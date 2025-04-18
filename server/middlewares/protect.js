import jwt from "jsonwebtoken";

// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่

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
    
    // Check if the token has expected claims
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
    // Different error messages based on error type
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      return res.status(401).json({ message: "Unauthorized: Token verification failed" });
    }
  }
}

export default protect;
