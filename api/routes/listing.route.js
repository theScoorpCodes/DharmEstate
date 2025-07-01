import { createListing, deleteListing, updateListing, getListing, deleteImage, getListings } from "../controllers/listing.controller.js";
import express from "express";
import { verifyToken } from "../utils/VerifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing)
router.delete("/delete-image", verifyToken, deleteImage);
router.get("/get", getListings);

export default router;
