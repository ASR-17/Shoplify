import AppError from "../utils/AppError.js";

const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};

export default roleMiddleware;
