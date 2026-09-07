require("dotenv").config()

const express=require("express")
const app=express()
const port=process.env.PORT ||5000;
const cookie = require("cookie-parser");
app.use(cookie());
const  auth=require("./routes/auth")
const user=require("./routes/user")
const admin=require("./routes/admin")
const connectDB = require("./config/db");
const cors=require("cors")



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/",auth)
app.use("/auth/user",user)
app.use("/auth/admin",admin)







app.listen(port,()=>{
    console.log("server is connected")
})