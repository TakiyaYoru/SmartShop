import mongoose from "mongoose";
import { CategorySchema } from "./category.js";
import { ProductSchema } from "./product.js";
import { UserSchema } from "./user.js";
import { BrandSchema } from "./brand.js";

export const Category = mongoose.model("Category", CategorySchema);
export const Product = mongoose.model("Product", ProductSchema);
export const User = mongoose.model("User", UserSchema);
export const Brand = mongoose.model("Brand", BrandSchema);