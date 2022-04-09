const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  const token = bearerToken?.split(" ")[1];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.payload = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = { verifyToken };
