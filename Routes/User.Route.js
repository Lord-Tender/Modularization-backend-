const express = require("express");
const router = express.Router();
const { welcomeUser, about, register, login, registerUser, loginUser, dashboard, uploadProfile, sendMail } = require("../Controllers/User.Controller")

router.get("/user", welcomeUser)
router.get("/about", about)
router.get("/register", register)
router.get("/login", login)
router.get("/send-mail", sendMail)
router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/dashboard", dashboard)
router.post("/upload", uploadProfile)

module.exports = router;//exporting the router to be used in the app.js file