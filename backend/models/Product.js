const mongoose=require("mongoose")

const productshema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unique:true
    },
    descrption:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        require:true
    },
   photo: {
      type: String,
      required: [true, "Product image URL is required"],
      trim: true,
      default:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    },
},{timestamps:true})

module.exports=mongoose.model("product",productshema)