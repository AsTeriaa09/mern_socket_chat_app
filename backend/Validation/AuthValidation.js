const z = require("zod");

const SignUpVal = z.object({
  name: z
    .string({ required_error: "Name cannot be empty" })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long!" })
    .max(125, { message: "Name cannot be more than 125 characters long!" }),
  email: z
    .string({ required_error: "Email cannot be empty" })
    .trim()
    .email({ message: "Invalid Email Address" })
    .min(3, { message: "Email must be at least 3 characters long!" })
    .max(125, { message: "Email cannot be more than 125 characters long!" }),
  password: z
    .string({ required_error: "Password cannot be empty" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long!" })
    .max(225, { message: "Password cannot be more than 225 characters long!" }),
});

const LoginVal = z.object({
  email: z
    .string({ required_error: "Email cannot be empty" })
    .trim()
    .email({ message: "Invalid Email Address" })
    .min(3, { message: "Email must be at least 3 characters long!" })
    .max(125, { message: "Email cannot be more than 125 characters long!" }),
  password: z
    .string({ required_error: "Password cannot be empty" })
    .trim()
    .min(6, { message: "Password must be at least 6 characters long!" })
    .max(225, { message: "Password cannot be more than 225 characters long!" }),
});

module.exports = { SignUpVal, LoginVal };
