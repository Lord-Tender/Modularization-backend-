const express = require('express')
const app = express()
require('dotenv').config()
let port = process.env.PORT
let uri = process.env.URI
let cors = require('cors')
const mongoose = require('mongoose')
const userRouter = require("./Routes/User.Route")
const allowedOrigins = [`http://localhost:5173`]

app.use(express.urlencoded( {extended:true, limit: "50mb"} ))

app.use(cors({
    origin: function (origin, callback) {
      // Check if the origin is allowed or if it's a request from the same origin (e.g., when running locally)
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  }))
app.use(express.json( { limit: "50mb" } ))
app.use('/', userRouter)


app.listen(port, ()=>{
    console.log('App listening on port 5000');
    mongoose.connect(uri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log(err);
    })
})