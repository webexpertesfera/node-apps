const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    default:" "
  },
  quantity: {
    type: Number,
    required:true
  },
  deliveryFee: {
    type: Number,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  productId: {
    type: String
  },
  productImages: {
    type: [String]  // If the array contains URLs or paths to images
  },
  productType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductTypes"
  },
  discountPercentage:{
    type:Number,
    default:" "
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Categories"
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessSeller',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = { Product };
