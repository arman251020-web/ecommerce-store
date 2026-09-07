const mongoose=require("mongoose")
const product=require("./Product")
const user=require("./User")
const wishlistschema= new mongoose.Schema({

    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:product,
    },],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user,
        required:true
    }
})
module.exports=mongoose.model("wishlist",wishlistschema);