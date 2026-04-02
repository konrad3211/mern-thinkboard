import ratelimit from "../config/upstash.js";
const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) return res.status(429).json({ error: "Too many requests" });
    next();
  } catch (err) {
    console.log("rateLimiter error", err);
    next(err);
  }
};

export default rateLimiter;
