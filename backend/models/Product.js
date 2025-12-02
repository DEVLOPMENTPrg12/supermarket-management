const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    image: {
      type: String, // lien de l'image ou path
      default: ""
    },
    SKU: {
      type: String,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    brand: {
      type: String,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
