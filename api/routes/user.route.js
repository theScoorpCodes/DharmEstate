import express from "express";
import { userTest, updateUser, deleteUser, getUserListings, getUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();

router.get("/test", userTest);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser)
router.get("/listings/:id", verifyToken, getUserListings)
router.get("/:id", verifyToken, getUser)

export default router;