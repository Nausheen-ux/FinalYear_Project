import express from "express";
import {
  sendRequest,
  getPropertyRequests,
  replyToRequest,
} from "../controllers/connectionRequestController.js";
import { updateRequestStatus } from '../controllers/connectionRequestController.js';

const router = express.Router();

// Student → Send request
router.post("/send", sendRequest);

// Owner → View requests for a specific property
router.get("/property/:propertyId", getPropertyRequests);

// Owner → Reply to a request
router.post("/reply/:id", replyToRequest);
router.put("/:id/status", updateRequestStatus);

export default router;
