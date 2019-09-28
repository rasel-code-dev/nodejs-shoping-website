const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim:true,
  },
  password: {
    type: String,
    required: true,
    trim:true,
  },
  email: {
    type: String,
    required: true,
    trim:true,
  },

  cart: {
    items : [
      { 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
      }
    ]
  }
})



module.exports = mongoose.model("User", userSchema)