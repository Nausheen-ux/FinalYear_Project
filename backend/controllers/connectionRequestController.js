import ConnectionRequest from "../models/ConnectionRequest.js";

// ======================= SEND REQUEST =======================
export const sendRequest = async (req, res) => {
  try {
    console.log("📩 Incoming connection request body:", req.body);

    const { propertyId, studentId, ownerId, message } = req.body;

    // ✅ Validate required fields
    if (!propertyId || !studentId || !ownerId) {
      console.log("❌ Missing fields:", { propertyId, studentId, ownerId });
      return res.status(400).json({
        success: false,
        message: "propertyId, studentId, and ownerId are required.",
      });
    }

    // ✅ Create and save the new connection request
    const newRequest = new ConnectionRequest({
      propertyId,
      studentId,
      ownerId,
      message: message || "",
    });

    await newRequest.save();
    console.log("✅ Connection request saved successfully:", newRequest);

    res.status(201).json({
      success: true,
      message: "Connection request sent successfully!",
      data: newRequest,
    });
  } catch (err) {
    console.error("❌ Error while sending connection request:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send connection request.",
      error: err.message,
    });
  }
};

// ======================= GET REQUESTS FOR A PROPERTY =======================
export const getPropertyRequests = async (req, res) => {
  try {
    const { propertyId } = req.params;
    console.log("📥 Fetching requests for propertyId:", propertyId);

    const requests = await ConnectionRequest.find({ propertyId })
      .populate("studentId", "_id name email")
      .populate("propertyId", "_id buildingName location");

    console.log(`✅ Found ${requests.length} requests for propertyId ${propertyId}`);

    res.json({
      success: true,
      data: requests,
    });
  } catch (err) {
    console.error("❌ Error fetching property requests:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch connection requests for this property.",
      error: err.message,
    });
  }
};

// ======================= REPLY TO REQUEST =======================
export const replyToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    console.log("📨 Replying to request:", id, "with message:", reply);

    const request = await ConnectionRequest.findByIdAndUpdate(
      id,
      { reply, status: "replied" },
      { new: true }
    );

    if (!request) {
      console.log("❌ Request not found with id:", id);
      return res.status(404).json({
        success: false,
        message: "Connection request not found.",
      });
    }

    console.log("✅ Reply saved successfully:", request);

    res.json({
      success: true,
      message: "Reply sent successfully!",
      data: request,
    });
  } catch (err) {
    console.error("❌ Error replying to request:", err);
    res.status(500).json({
      success: false,
      message: "Failed to reply to connection request.",
      error: err.message,
    });
  }
};
// ======================= UPDATE STATUS (approve/reject) =======================
export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Connection request not found." });
    }

    res.json({
      success: true,
      message: `Connection ${status} successfully!`,
      data: updatedRequest,
    });
  } catch (err) {
    console.error("❌ Error updating connection status:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update connection status.",
      error: err.message,
    });
  }
};

