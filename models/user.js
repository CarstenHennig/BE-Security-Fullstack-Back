import mongoose from "mongoose";
import { hash, compare } from "../libs/crypto.js";

const required = true;
const unique = true;
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required, unique, minlength: 3 },
  password: { type: String, required, minLength: 20 },
});

userSchema.statics.register = async (userData) => {
  userData.password = await hash(userData.password);

  try {
    return await User.create(userData);
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

userSchema.statics.login = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    return null;
  }

  const success = await compare(userData.password, user.password);

  if (!success) {
    return null;
  }

  return user.toJSON();
};

userSchema.methods.toJSON = function () {
  return {
    email: this.email,
    _id: this._id,
  };
};

export const User = mongoose.model("fullstack-users", userSchema);
