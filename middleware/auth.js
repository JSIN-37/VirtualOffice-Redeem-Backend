// JWT AUTHENTICATION
const cfg = process.env; // Get server configurations

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let bearerToken = false;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[0] === "Bearer"
  ) {
    bearerToken = req.headers.authorization.split(" ")[1];
  }
  const token = req.body.token || req.query.token || bearerToken;
  if (!token) {
    return res.status(403).json({ error: "You are not authenticated." });
  }
  try {
    const authData = jwt.verify(token, cfg.JWT_KEY);
    // Token is good
    req.authData = authData; // Store authData
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
  return next();
};

const verifyAdmin = (req, res, next) => {
  if (req.authData.isAdmin) {
    return next();
  } else {
    return res.status(403).json({ error: "You are not authenticated." });
  }
};

module.exports = { verifyToken, verifyAdmin };
