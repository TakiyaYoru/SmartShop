// File: server/data/models/index.js - ADD Review import
import mongoose from "mongoose";
import { CategorySchema } from "./category.js";
import { ProductSchema } from "./product.js";
import { UserSchema } from "./user.js";
import { BrandSchema } from "./brand.js";
import { CartSchema } from "./cart.js"; 
import { OrderSchema } from "./order.js";
import { OrderItemSchema } from "./orderItem.js";
import { ReviewSchema } from "./review.js"; // ADD THIS LINE

export const Category = mongoose.model("Category", CategorySchema);
export const Product = mongoose.model("Product", ProductSchema);
export const User = mongoose.model("User", UserSchema);
export const Brand = mongoose.model("Brand", BrandSchema);
export const Cart = mongoose.model("Cart", CartSchema); 
export const Order = mongoose.model("Order", OrderSchema);
export const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
export const Review = mongoose.model("Review", ReviewSchema); // ADD THIS LINE