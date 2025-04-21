import { ObjectId } from "mongodb";
import { Router } from "express";
import { connectDb } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authRouter = Router();
const JWT_SECRET = process.env.SECRET_KEY; 

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
  
    if (!username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }
  
    try {
      const db = await connectDb();
      const usersCollection = db.collection("users");
  
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = {
        _id: new ObjectId(),
        username,
        password: hashedPassword,
        firstName,
        lastName,
        createdAt: new Date(),
      };
  
      await usersCollection.insertOne(newUser);
  
      res.status(201).json({ message: "User has been created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Registration error" });
    }
  });

// 🐨 Todo: Exercise #2
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้
authRouter.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Please enter username and password" });
    }
  
    try {
      const db = await connectDb();
      const usersCollection = db.collection("users");
  
      const user = await usersCollection.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      const token = jwt.sign(
        {   userId: user._id, 
            username: user.username, 
            firstname: user.firstName, 
            lastname: user.lastName,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({
        message: "login successfully",
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Database Error" });
    }
  });

export default authRouter;
