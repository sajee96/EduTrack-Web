const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Admin = require('../models/admin')
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
const createError = require('http-errors');
const {authSchema} = require('../config/validation_schema');
const {signAccessToken} = require('../config/jwt_helper');

router.use(express.json())

// New app using express module
const app = express();
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
//Routes

router.post('/register', async(req, res, next) =>{
  try{
    const {email, password} = req.body;
    // if(!email || !password) throw createError.BadRequest();
    const result = await authSchema.validateAsync(req.body);
    console.log(result)

    const doesExist = await Admin.findOne({email: result.email});
    if(doesExist){
      throw createError.Conflict(`${email} is already been registered`);
    }

    const admin = new Admin({email, password})
    const savedAdmin = await admin.save();
    const accessToken = await signAccessToken(savedAdmin.id)
    res.send({accessToken});
  }
  catch(error){
    if(error.isJoi === true) error.status = 422
    next(error);
  }
});

router.post('/login', async(req, res, next) =>{
  res.send('Login route')
});

router.post('/refresh-token', async(req, res, next) =>{
  res.send('Refresh route')
});

router.delete('/logout', async(req, res, next) =>{
  res.send('Logout route')
});

router.get('', async(req, res) => {
    const locals = {
        title: "Edu Track",
        description: "University of ......"
    }
    try{
      const data = await  Student.find();
      res.render('index', { locals, data});
    }
    catch(error){
      console.log(error);
    }
});

router.post('/create-student', (req, res, next) => {
  // console.log(req.body);
  const student = new Student({
    _id: new mongoose.Types.ObjectId,
    student_id: req.body.student_id,
    name:req.body.name,
    email:req.body.email,
    dob:req.body.dob,
    subject:req.body.subject,
    location:req.body.location,
    is_agree: req.body.is_agree,
    is_correspondence: req.body.is_correspondence,
    status:req.body.status
  });
  student.save().then(result => {
    console.log(result);
  })
  .catch(err => console.log(err));
  res.status(201).json({
    message: 'Handling Post request to /student',
    createdStudent: student,
  })
})




// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();


module.exports = router;