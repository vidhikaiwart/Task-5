import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2] || "admin@example.com";
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found in environment.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    const user = await User.findOneAndUpdate({ email }, { role: "admin" }, { new: true });
    if (user) {
      console.log(`Success: Promoted ${email} to admin! User details:`, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.log(`Error: User with email ${email} not found. Please register this user first.`);
    }
  } catch (error) {
    console.error("Error promoting user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

makeAdmin();
