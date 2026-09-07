const express= require("express")
const router = express.Router();
const admin_sercet=process.env.JWT_SECRET_ADMIN;
const sercet=process.env.JWT_SECRET;
const user=require("../models/User")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


router.get("/login",(req,res)=>{
    res.send("you are in login page")
})

router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;

        const isemail= await user.findOne({email})
        if(!isemail){
             return res.status(409).json({
                message: "SOMETHING WENT WRONG"
            });
        }
        const ispass= await bcrypt.compare(password,isemail.password);
        if(!ispass){
             return res.status(409).json({
                message: "SOMETHING WENT WRONG"
            });
        }
        
        if(isemail.role==="user"){
             const token = jwt.sign(
            { id: isemail._id,
                email: isemail.email,
                role: isemail.role
            },sercet,{expiresIn: "12h"}
        );
        res.cookie("userToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000
        });
            
        }

        //admin
        if(isemail.role==="admin"){
             const token = jwt.sign(
            { id: isemail._id,
                email: isemail.email,
                role: isemail.role
            },admin_sercet,{expiresIn: "12h"}
        );
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "lax",
            maxAge: 12 * 60 * 60 * 1000
        });
           
        }
        console.log("login")
        return res.status(200).json({
    message: "Login successful",
    user: {
        id: isemail._id,
        name: isemail.name,
        email: isemail.email,
        role: isemail.role
    }
});
    } catch (error) {
        console.error(error)
    }
})




module.exports=router;