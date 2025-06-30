import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/Error.js";

const createListing = async (req, res, next) => {
    try {
      const listing = await Listing.create(req.body);
      return res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
}

const deleteListing = async (req, res, next) => {
  try{
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, "Listing not found"));
    if(listing.userRef !== req.user.id) return next(errorHandler(403, "You are not allowed to delete this listing"));

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
}

const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing) return next(errorHandler(404, "Listing not found"));
  if(listing.userRef !== req.user.id) return next(errorHandler(403, "You are not allowed to update this listing"));

  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
}

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, "Listing not found"));
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
}

export { createListing, deleteListing, updateListing, getListing }