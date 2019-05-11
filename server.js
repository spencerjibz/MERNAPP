let path = require('path')
let express = require('express')
let helmet = require('helmet')
let cors = require('cors')
const config = require('./config')
let port = config.PORT;
let parser = require('body-parser')
let db = require('mongoose')
let logger = require('morgan')
let override = require('method-override')
let expressValidator = require('express-validator')
let compression = require('compression')
let multer = require('multer')
const {log} = console
// app instance
const app = express()
// middleware section
app.use(parser.json())
app.use(parser.urlencoded({extended:true}))
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(logger('dev'))
app.use(expressValidator());
app.disable('x-powered-by')
// import router
let router = require('./api/routes')
// Public folder for assets
app.use(express.static(__dirname='./client/src/assets/uploads/'))


// setup the router to external file
app.use('/api',router)
app.use(override())
// error handling
app.use(function(err,req,res,next){
    if(err) { res.status(err.status||500)
    res.json({
       error: " opps something wrong , contact the administer"
    })
    log(err)
}
next()
})
// Serve static assets if in production
if (process.env.NODE_ENV==='production'){
// set static folder
app.use(express.static('client/build'))
app.get('*',(req,res)=>{
res.sendFile(path.resolve(__dirname,'client','build','index.html'))

})
}
// init app
app.listen(port,()=>{
    log(`app started at  port ${config.PORT}`)
    db.set({UseCreateIndexes:true})
   db.connect(config.MONGODB_URI,{useNewUrlParser:true}).then(()=>{
   let User = require('./lib/User-model')
   let Photo = require('./lib/photo-schema.js')
       log('database started successfully')
    })
   .catch(e=> log(e))

})
//

