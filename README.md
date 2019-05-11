# [MERNAPP]()
 THIS IS A FULLSTACK MERNAPP WITH A NODEJS-BACKEND API AND REACT FOR CLIENT.REACT IS INTEGRATED WITH P5JS,BOOTSTRAP AND JQUERY FOR THIS PROJECT.<br>
 THE APP IS A FULL IMPLEMENTATION OF THE NODE-CRUD APP([PARTIAL-MERNAPP](https://github.com/spencerjibz/PARTIAL-MERN-APP)) USING REACT FOR COMPARISON BUTWEEN SERVER-SIDE RENDERD AND CLIENT-SIDE RENDERED APPS
## Requirements

- MongoDB (local/remote) 

- Email account for nodemailer

- Nodejs

## Application Specs
- sends emails using nodemailer
- Uploads files to the Backend server using multer
- uses both React for client-side and Redux for statemanagement 
- authentication and authorization is supported using JWT and  React-router-dom middleware
- mongoose ODM for mongodb
- fs module for used to manage some files (profile page)
- os module for get platform information used to edit directorypaths specific to each platform
- A full REST API(node-backend) is used
- Media player and webcam in the abouts page 

## Usage
 1 .**[checkout the LiveDemo](https://hidden-earth-45154.herokuapp.com/)**
 
 2 .**For copy of the app**
 
 - clone the repo or download zipped folder
 
  ``` git clone https://github.com/spencerjibz/MERNAPP.git && cd MERNAPP && npm install && cd client && npm install ```
- Edit the keys.js file in the config folder, add  the mongodb uri and the email credentials
```
/config/keys.js

module.exports ={
    // enter the uri for production mongodb 
 module.exports = {
    ENV:process.env.NODE_ENV||'development',
    PORT:process.env.PORT||5000,
    URL:process.env.BASE_URL||'http://localhost:5000',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/myapi',
    TOKEN_SEC:process.env.TOKEN_SEC||'secretKey',
    NODE_MAILER_EA: process.env.NODE_MAILER_EA ,
    NODE_MAILER_SERVICE:process.env.NODE_MAILER_SERVICE||'Gmail',
    NODE_MAILER_PASS: process.env.NODE_MAILER_PASS ,
    ADMIN_NAME:''//['an array of authorized users']
    /*
    ADD AS MUCH CONFIG PROPS AS YOU LIKE FProOR YOUR APP, 

    
    */
}



```
 + >> Start the App using command below and check it out at [http://localhost:3000](http://localhost:3000)
 
 ``` npm start ```
 
 3. **sign up, login and checkout all the features** 
