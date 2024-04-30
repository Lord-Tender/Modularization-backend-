const userModel = require("../Models/user.model");
const bcrypt = require("bcrypt");
let secret = process.env.SECRET
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const nodemailer = require("nodemailer")


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const welcomeUser = (req, res) => {
    res.send("Welcome to the User Route");
}

const about = (req, res) => {
    res.send("Its crazy");
}

const register = (req, res) => {
    res.send("register here!!!");
}

const login = (req, res) => {
    res.send("Login here");
}

const registerUser = (req, res) => {
    console.log(req);
    const { firstName, lastName, email, password } = req.body
    let saltRounds = 10
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    let user = new userModel({ firstName, lastName, email, password: hashedPassword });
    user.save()
        .then((response) => {
            console.log(res);
            console.log("User saved successfully");
            res.status(201).json({ Message: "User saved successfully" });
            console.log("the save console" + response);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ Message: "Failed" });
        })
}

const loginUser = async (req, res) => {
    // res.send("Login here");
    const { email, password } = req.body

    try {
        let user = await userModel.findOne({ email: email })
        if (!user) {
            console.log("User not found");
            res.status(404).json({ Message: "User not found" })
        }

        let comparedPassword = bcrypt.compareSync(password, user.password);
        if (!comparedPassword) {
            console.log("Password not matched");
            res.status(404).json({ Message: "Password not matched" })
        }


        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: 10 });
        res.status(200).json({
            Message: "User found",
            token: token,
            user: user
        })
    }
    catch (err) {
        console.log(err);
    }

}

const dashboard = (req, res) => {
    let token = req.headers.authorization.split(" ")[1]
    console.log(token);
    jwt.verify(token, secret, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ Message: "User not found", error: err })
        } else {
            console.log(result);
            return res.status(200).json({ Message: "User found", user: result })
        }
    })
}

const uploadProfile = (req, res) => {
    let file = req.body.myfile;
    cloudinary.uploader.upload(file, { public_id: "olympic_flag" }, (result, error) => {
        if (result) {
            console.log(result);
            res.status(200).json({ Message: "File uploaded successfully", result: result })
        } else {
            console.log(error);
        }
    });
}

let htmltext = ` <div style="background-color: "black" >
    <h1>Html Text</h1>
</div >`


const sendMail = (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    })
    let mailOption = {
        from: process.env.EMAIL,
        to: "emmylove961@gmail.com",
        subject: "Test mail",
        html: htmltext
    }

    transporter.sendMail(mailOption, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    })
}




module.exports = { welcomeUser, about, register, login, registerUser, loginUser, dashboard, uploadProfile, sendMail }