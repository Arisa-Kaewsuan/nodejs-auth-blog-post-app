import jwt from "jsonwebtoken";

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the header

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Optional: Check for specific claims (if required)
    if (!decoded.userId || !decoded.role) {
      return res.status(401).json({ message: "Unauthorized: Invalid token structure" });
    }
    
    // Check token expiration explicitly (additional safety check)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    
    // Attach the decoded user data to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    const message =
      error.name === "TokenExpiredError"
        ? "Unauthorized: Token expired"
        : "Unauthorized: Invalid token";
    return res.status(401).json({ message });
  }
}

export default protect;
