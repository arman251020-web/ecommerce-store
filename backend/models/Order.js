const mongoose = require("mongoose");
const User = require("./User");

const Orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true

    },
    product: [
        {
            product: {
                 type:mongoose.Schema.Types.ObjectId,
                 ref:"product"   
            },
            quantity:{
                type:Number
            }
        },

    ],
    status:{
        type:String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default:"Pending"
    }
})

module.exports = mongoose.model("oder", Orderschema)