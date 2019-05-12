let mongoose = require('mongoose')
let { Schema } = mongoose
let os = require('os')//  this module provide information about the operating system
let path = require('path')
let fs = require('fs') // this nodejs module is intended to managed my uplaad folder and its contents
const { platform } = os
let config = require('../config')
const Grid = require('gridfs-stream')
let gfs;

let conn = mongoose.createConnection(config.MONGODB_URI);
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')

    // all set!
})

// test for  the os
let IsWins = /win/.test(platform())
let IsLinux = /linux/.test(platform())

let photo = new Schema({
    username: { type: String, required: true, index: { unique: true } },

    photoName: { type: String, trim: true, required: true },


})

const { log } = console
let photoapi = module.exports = mongoose.model('photo', photo)
// FUNCTION THAT SAVES A USER'S PHOTO INFORMATION
module.exports.Savephoto = function (username, name, cb) {
    query = new photoapi({ username: username, photoName: name })
    query.save(cb)
}
// FUNCTION THAT  RETRIEVE THE USER'S PHOTO INFORMATION

module.exports.Findphoto = function (filename, cb) {
   gfs.files.findOne({filename},cb)

}
// FUNCTION THAT CHANGES THE USER'S PHOTO
module.exports.Updatephoto = function (username,imageName, cb) {
    photoapi.findOne({
        username: username
    }, function (err, ismatch) {
        if (err || ismatch == null) {
            cb(new Error('match not found'))
        } else {
// delete the filename from the database
            gfs.remove({filename:ismatch.photoName,root:'uploads'}, function (err) {
               
  if (err) {
      cb(err)

  } else {
               
                    photoapi.findOneAndUpdate({
                        username: username
                    }, {
                        photoName:imageName
                    }, cb)
                
           
                 }     })
        }
    })
}
// FUNCTION THE DELETES THE USER'S PHOTO
module.exports.Deletephoto = function (username, cb) {
    // fetch to filepath from the database  for usage in the next stage
    photoapi.findOne({username}, function (err, photo) {
    
        if (photo !== null) {
             gfs.remove({filename:photo.photoName,root:'uploads'}, function (err, done) {
                        if (err) {
                            log(err)
                        } else {
                            photoapi.findOneAndDelete({
                                username
                            }, cb) 
                        }
                    })
                
        }
        cb(null,false)

    })
}