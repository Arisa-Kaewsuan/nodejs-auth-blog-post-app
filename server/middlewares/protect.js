// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่

import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ตรวจสอบว่ามี header หรือไม่ และอยู่ในรูปแบบ Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // อย่าลืมตั้งค่า JWT_SECRET ใน .env
    req.user = decoded; // ส่งข้อมูล user ที่ decode ได้ต่อให้ middleware/route ถัดไป
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
};

export default protect;
