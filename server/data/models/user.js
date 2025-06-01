import mongoose from "mongoose";

let Schema = mongoose.Schema;
let String = Schema.Types.String;

export const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    role: {
      type: String,
      enum: ['admin', 'manager', 'customer'],
      default: 'customer',
    },
    phone: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);