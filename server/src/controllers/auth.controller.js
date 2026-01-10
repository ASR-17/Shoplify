import User from "../models/User.model.js";
import { loginSchema, registerEmployeeSchema } from "../validations/auth.validation.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import generateToken from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";

export const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new AppError("Invalid credentials", 401);

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const registerEmployee = async (req, res, next) => {
  try {
    const { error } = registerEmployeeSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) throw new AppError("User already exists", 409);

    const hashed = await hashPassword(password);

    const employee = await User.create({
      name,
      email,
      password: hashed,
      role: "employee",
    });

    res.status(201).json({
      success: true,
      message: "Employee created",
      employee: {
        id: employee._id,
        email: employee.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};
