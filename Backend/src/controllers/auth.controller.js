const bcrypt = require("bcrypt");
const {createUser, findByName} = require("../model/user.model");
const jwt = require("jsonwebtoken");


async function registerController(req, res) {
    const {name, password} = req.body;
    if (!name || !password) {
    return res.status(400).json({
        message: "Please provide Username & Password both."
    });
}
    const isUserExist = await findByName(name);
    if(isUserExist){
        return res.status(400).json({
            message: "Username Already Exist!"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(name, hashedPassword);

    const token =jwt.sign({
        id: user.insertId,
        name: name
    },process.env.JWT_SECRETE, { expiresIn: "1d" });

    res.cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(201).json({
        message:"User registered successfully",
        user:{
            name: name,
        }
    });
    
}

async function loginController(req, res) {
    const {name, password} = req.body;
    if(!name || !password){
        return res.status(400).json({
            message:"Please provide Username & Password both."
        });
    }
    //it is returning name, id, password.
    const user = await findByName(name);

    if(!user){
        return res.status(401).json({
            message: "Invalid username or password. Register an account first if you are a new user."
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Please enter a valid Password."
        })
    }
    const token =jwt.sign({
        id: user.id,
        name: user.name
    },process.env.JWT_SECRETE, { expiresIn: "1d" });

    res.cookie("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            name: user.name,
        }
    });
}

async function logOutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({
            message: "No token found to blacklist."
        });
    }
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    res.status(200).json({
        message: "User Logged out successfully!"
    });
   
}

async function getMeController(req, res) {

    res.status(200).json({
        user: req.user
    });

}

module.exports ={ registerController, loginController, logOutController, getMeController };