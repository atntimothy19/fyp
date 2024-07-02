import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Extract the token from req.cookies.jwt (assuming it's already a string)
  const token = req.cookies.jwt;

  // Check if token exists
  if (!token) {
    return res.status(401).send("You are not authenticated!"); // Unauthorized
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(403).send("Token is not valid!"); // Forbidden
    }

    // If token is valid, extract userId from payload and attach it to req
    req.userId = payload.userId; // Adjust this according to your payload structure

    // Proceed to the next middleware
    next();
  });
};
