
let config= {
    ENV:process.env.NODE_ENV||'development',
    PORT:process.env.PORT||7000,
    URL:process.env.BASE_URL||`http://localhost:${7000}`,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://mern:mern2019@ds343985.mlab.com:43985/myapi',
    TOKEN_SEC:process.env.TOKEN_SEC||'secretKey',
    NODE_MAILER_EA: process.env.NODE_MAILER_EA || 'merns20@gmail.com',
    NODE_MAILER_SERVICE:process.env.NODE_MAILER_SERVICE||'Gmail',
    NODE_MAILER_PASS: process.env.NODE_MAILER_PASS || 'mern@2018',
    ADMIN_NAME:'spencerjibz'//['an array of authorized users']
    /*
    ADD AS MUCH CONFIG PROPS AS YOU LIKE FProOR YOUR APP, 

    
    */
}
module.exports = config