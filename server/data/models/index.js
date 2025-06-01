import mongoose from "mongoose";
import { CategorySchema } from "./category.js";
import { ProductSchema } from "./product.js";
import { UserSchema } from "./user.js";

export const Category = mongoose.model("Category", CategorySchema);
export const Product = mongoose.model("Product", ProductSchema);
export const User = mongoose.model("User", UserSchema);