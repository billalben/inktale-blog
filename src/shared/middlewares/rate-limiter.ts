import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again after 5 minutes",
});
