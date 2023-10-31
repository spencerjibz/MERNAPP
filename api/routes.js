let express = require("express");
let path = require("path");
let multer = require("multer");
let jwt = require("jsonwebtoken");
let User = require("../lib/User-model");
let Photo = require("../lib/photo-schema.js");
let config = require("../config");
let authCheck = require("./api-auth.js");
let nodemailer = require("nodemailer");
let getUnique = require("../lib/getUniqueArray");
let crypto = require("crypto");
const Grid = require("gridfs-stream");
let GridFsStorage = require("multer-gridfs-storage");
const expressValidator = require("express-validator");
let mongoose = require("mongoose");
const { check, validationResult } = require("express-validator/check");
const { log } = console;

let gfs;

let conn = mongoose.createConnection(config.MONGODB_URI);
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");

  // all set!
});

// create a gridfs storage engine for multer
const storage = new GridFsStorage({
  url: config.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  const { mimetype } = file;

  let exp = /image/g;
  let testmatch = exp.test(mimetype);
  if (testmatch == true) {
    cb(null, true);
  } else {
    cb(new Error("file uploaded is not an image, upload only images files"));
  }
};
const Upload = multer({ storage, fileFilter }).single("avatar");

// intial router instance
let router = express.Router();
//export our router
module.exports = router;
// NODE MAILER TRANSPORTER
const ea = config.NODE_MAILER_EA;
const pass = config.NODE_MAILER_PASS;

//  NODE MAILER TRANSPORTER OBJECT
const transporter = nodemailer.createTransport({
  service: config.NODE_MAILER_SERVICE,

  auth: {
    user: config.NODE_MAILER_EA,
    pass: config.NODE_MAILER_PASS,
  },
  // proxy configuration
  // proxy:'socks5://localhost:9000',
  logger: true, // log to console
  debug: true,
});
//transporter.set('proxy_socks_module', require('socks'))
//transporter.use('stream', Encrypt())
// routes
router.get("/", (req, res) => {
  res.json({ message: "welcome to my Api" });
});
// route that create and get token
router.post("/login", (req, res) => {
  let test = Object.keys(req.body).length > 0 && req.body !== null;

  if (test == true) {
    let username = req.body.email;
    let { password } = req.body;

    User.loginUser(username, password, (err, user) => {
      if (err) {
        res.json({ code: 404, error: err.message });
        log(err);
      } else {
        delete user._doc.password;
        delete user._doc.__v;

        jwt.sign(
          { user },
          config.TOKEN_SEC,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              log(err);
            }
            res.json({
              token,
            });
            req.user = user;
            log(res.locals.user);
          },
        );
      }
    });
  } else {
    res.json({
      code: 404,
      error: "NO named resource requested",
    });
  }
});
// using token
router.post("/post", authCheck, (req, res) => {
  jwt.verify(req.token, config.TOKEN_SEC, (err, authdata) => {
    if (err) {
      res.json({ code: 404, error: `token is invalid or has expired` });
    } else {
      User.getUserByUsername(authdata.user.username, (err, user) => {
        err
          ? res.json({ code: 404, error: "Not Found" })
          : delete user._doc.password;
        delete user._doc.__v;
        res.json({ user });
      });
    }
  });
});
// route that create a user

router.post(
  "/create",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email must between 10 and 100 characters long").isLength({
      min: 10,
      max: 100,
    }),

    check("password", "password is required").not().isEmpty(),
    check(
      "password",
      "passwords must be atleast 8 characters long and contain at least one number,one lowercase and an Uppercase letter ",
    )
      .isLength({
        min: 8,
      })
      .matches(/\d/)
      .matches(/[a-z]/)
      .matches(/[A-Z]/),

    check("confpassword", "Passwords must match")
      .exists()
      .custom((value, { req }) => {
        return value === req.body.password;
      }),
  ],
  (req, res) => {
    // password validation alternative
    req.checkBody("email", "Email is not valid").isEmail();
    req
      .checkBody("confpassword", "Passwords must match")
      .equals(req.body.password);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        code: 422,
        ValidationErrors: getUnique(errors.array(), "param").map((v) => {
          delete v.value;
          return v;
        }),
      });
    } else {
      let test = Object.keys(req.body).length > 0;
      if (test) {
        let { name, password } = req.body;
        let username = req.body.email;
        let newUser = { name, username, password };
        User.createUser(newUser, function (err, user) {
          if (err) {
            res.json({
              code: 404,
              error: `failed to create new user because the user already exists`,
            });
          } else {
            res.json({
              message: "Acount created, you can now login ",
            });
          }
        });
      }
    }
  },
);
// route to  fetch all the users from data
router.post("/users", authCheck, (req, res) => {
  jwt.verify(req.token, config.TOKEN_SEC, function (err, data) {
    if (err) {
      res.sendStatus(401);
    } else {
      let test = new RegExp(config.ADMIN_NAME).test(data.user.username);
      log(config.ADMIN_NAME);
      // make sure the config.admin_name contains a name in the username (email) of the admin
      test == true
        ? User.collectedinfo(function (err, users) {
            if (err) {
              res.json({
                code: 404,
                message: "opps, contact the administer",
              });
            } else {
              res.json(
                users.map((v) => {
                  delete v._doc.password;
                  delete v._doc.__v;
                  return v._doc;
                }),
              );
            }
          })
        : res.json({ message: "you are not an admin" });
    }
  });
});
// route to delete the username from the database
router.post("/deleteone", authCheck, (req, res) => {
  jwt.verify(req.token, config.TOKEN_SEC, (err, data) => {
    err
      ? res.json({ code: 404, error: err.message })
      : req.body.email !== data.user.username
      ? res.json({
          code: 404,
          error: `invalid username (email address)`,
        })
      : User.deleteUser(req.body.email, (err, isdone) => {
          if (err) {
            log(err);
          }
          if (isdone) {
            Photo.Deletephoto(req.body.email, (err, done) => {
              err
                ? log(err)
                : log(` ${done.photoName} has been deleted successfully`);
            });
            res.json({
              message: "account deleted successfully",
            });
          } else {
            res.json({
              code: 404,
              error: " Failed to delete account, username is incorrect",
            });
          }
        });
  });
});
// router to Change any specific property of the user  except the password,username and anyunavailable properities

router.post("/changeinfo", authCheck, (req, res) => {
  let username = req.body.email;
  //  makes a user change other values except the password, username or email
  let changable = Object.entries(req.body).filter((v) => {
    // get an array that contain only specific values(only including the specified values)
    if (
      !v.includes("email") &&
      !v.includes("password") &&
      v !== undefined &&
      v !== null &&
      !v.includes("username")
    ) {
      return v;
    }
  });

  // extract the desired attributes
  let query_name = changable[0][0];
  let query_value = changable[0][1];
  let filter = { [query_name]: [query_value] };
  // the function makes sure, a user can change only properties that exist in the database
  User.getUserByUsername(username, (err, info) => {
    let test = Object.keys(info._doc).includes(query_name);
    //log(test)
    test !== true
      ? res.json({
          err: ` a ${query_name} property doesn't exist for the user   `,
        })
      : User.findOneAndUpdate(
          {
            username,
          },
          filter,
          (err, updated) => {
            err
              ? res.json({
                  err: `failed to change your ${query_name}`,
                })
              : res.json({
                  message: ` your ${query_name} was successfully changed  to ${updated[query_name]}`,
                });
          },
        );
  });
});

// route the reset the  users password (this is protected)
router.post("/pass_reset/:token", (req, res) => {
  let { password } = req.body;
  // log(req.params.token)
  jwt.verify(req.params.token, config.TOKEN_SEC, (err, data) => {
    if (err) {
      res.sendStatus(401);
    } else {
      User.changedinfo(data.user.username, password, (err, isdone) => {
        if (err) {
          res.json({ error: " enter the right password" });
        } else {
          res.json({
            message: `Hey ${isdone.name}, you have managed to reset your password, you can now login `,
          });
        }
      });
    }
  });
});
router.post("/forgot_pass", (req, res) => {
  let test =
    Object.keys(req.body).length > 0 &&
    req.body !== null &&
    req.body.hasOwnProperty("email");
  !test
    ? res.json({
        code: 401,
        error: `no email address provided, can't complete`,
      })
    : User.getUserByUsername(req.body.email, function (err, user) {
        if (err) throw err;
        if (!user) {
          res.json({ error: "Unknown email, please signup" });
        } else {
          //  THE NODEMAILER TRANSPORTER OBJ

          // SETUP EMAIL DATA WITH UNICODE SYMBOLS
          let mailOptions = {
            from: config.NODE_MAILER_EA,
            to: req.body.email,
            subject: "PASSWORD RESET FROM  MYSITE ",
            text: "Hello there, this is a message from mysite",
            html: "<br><p> <strong>Read the instructions below on how to reset your password:</strong></p> <br> <ul><li> use this link below  </li> <br><li><a href='http://localhost:9000/pass_reset'> reset password </a></li>",
          };
          // SEND THE MAIL WITH DEFINED TRANSPORT OBJECT
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.json({
                error: "Opps !! connection failed, try again later",
              });
            } else {
              res.json({
                message: `Reset instructions  have been sent to your email, check your inbox in a few minutes`,
              });
            }
          });
        }
      });
});
router.post(
  "/contact",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email must between 10 and 100 characters long").isLength({
      min: 10,
      max: 100,
    }),
    check("message", "Empty messages are not accepted").not().isEmpty(),
    check("subject", "include a subject to the your message").not().isEmpty(),
  ],
  (req, res) => {
    let { name, email, message } = req.body;
    log(message);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({
        code: 422,
        ValidationErrors: getUnique(errors.array(), "param").map((v) => {
          delete v.value;
          return v;
        }),
      });
    } else {
      let mailOptions = {
        from: req.body.email,
        to: ea,
        subject: req.body.subject,
        html: `
                 <div>
                 <p> 
                 <strong>${req.body.message}
                 </strong></p>
                 </div>`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          res.json({
            code: "404",
            error: `Opps, connection failed try again later`,
          });
        } else {
          res.json({
            message: `Hello ${req.body.name}  your message was successful recieved, we will get back to  me as soon as possible`,
          });
        }
      });
    }
  },
);
// post route to handle profile photo images
router.post("/photo", authCheck, (req, res) => {
  jwt.verify(req.token, config.TOKEN_SEC, (err, userData) => {
    err
      ? res.json({
          error: err.message,
        })
      : Upload(req, res, (err) => {
          err || req.file === undefined || req.file.path === null
            ? res.json({
                error:
                  err !== undefined && err !== null
                    ? err.message
                    : "no files submitted",
              })
            : Photo.findOne(
                { username: userData.user.username },
                (err, isfound) => {
                  if (err) {
                    log(err);
                  } else if (isfound) {
                    res.json({
                      error: `user's profile picture already exists`,
                    });
                  } else {
                    let photoName = req.file.filename;

                    Photo.Savephoto(
                      userData.user.username,
                      photoName,
                      (err, img) => {
                        if (err) {
                          log(err);
                        } else {
                          res.json({
                            message: "image uploaded successfully",
                            img,
                          });
                          log(
                            `${userData.user.name} has added a new photoimage at ${req.file.path}`,
                          );
                        }
                      },
                    );
                  }
                },
              );
        });
  });
});
// fetch a user's photo
router.post("/profile-photo", authCheck, (req, res) => {
  let readable;
  let test =
    Object.keys(req.body).length > 0 &&
    req.body !== null &&
    req.body.hasOwnProperty("email");
  Photo.findOne({ username: req.body.email }, (err, isfound) => {
    err || isfound === null
      ? res.json({
          code: 404,
          error:
            err !== undefined && err !== null
              ? err.message
              : "no photoinfo found",
        })
      : Photo.Findphoto(isfound.photoName, (err, photodata) => {
          err || photodata === null
            ? res.json({
                code: 404,
                error:
                  err !== undefined && err !== null
                    ? err.message
                    : "no photoinfo found",
              })
            : (readable = gfs.createReadStream(photodata.filename));
          res.set("Content-Type", photodata.contentType);
          readable.pipe(res);
        });
  });
});
// get photo
router.get("/profile-photo/:username", (req, res) => {
  let readable;
  Photo.findOne({ username: req.params.username }, (err, isfound) => {
    err || isfound === null
      ? res.end("not Found")
      : Photo.Findphoto(isfound.photoName, (err, photodata) => {
          err || photodata === null
            ? res.end("file not found")
            : (readable = gfs.createReadStream(photodata.filename));
          res.set("Content-Type", photodata.contentType);
          readable.pipe(res);
        });
  });
});
// update user'photo
router.post("/updatephoto", authCheck, (req, res) => {
  jwt.verify(req.token, config.TOKEN_SEC, (err, userdata) => {
    err
      ? res.json({
          error: err.message,
        })
      : Upload(req, res, (err) => {
          if (err || req.file === undefined) {
            res.json({
              error:
                err !== undefined && err !== null
                  ? err.message
                  : "no files submitted",
            });
          } else {
            let photoName = req.file.filename;
            Photo.Updatephoto(
              userdata.user.username,
              photoName,
              (err, photodata) => {
                if (err || photodata === null) {
                  res.json({
                    code: 404,
                    error:
                      err !== undefined && err !== null
                        ? err.message
                        : "no photo info found",
                  });
                } else {
                  res.json({
                    photodata,
                  });
                }
              },
            );
          }
        });
  });
});
