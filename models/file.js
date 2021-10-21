import mongoose from "mongoose";

const { Schema } = mongoose;
const required = true;

const fileSchema = new Schema({
  fieldname: { type: String, required, maxLength: 200 },
  originalname: { type: String, required },
  mimetype: { type: String, required },
  destination: { type: String, required },
  filename: { type: String, required },
  path: { type: String, required },
  size: { type: Number, required },
});

export const File = mongoose.model("files", fileSchema);
