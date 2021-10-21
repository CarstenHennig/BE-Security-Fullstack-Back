import { body } from "express-validator";

export const messagerules = [
  body("message")
    .isLength({ min: 0, max: 120 })
    .withMessage("Message length must be between 0 and 120"),
  body("message")
    .isAlphanumeric("de-DE")
    .withMessage("invalid characters in message"),
  body("message").trim(),
  body("message").blacklist("e"),
];
