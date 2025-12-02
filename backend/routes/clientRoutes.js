const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const protect = require("../middleware/protect");
const authorizeRoles = require("../middleware/authorizeRoles");


// Create a new client

// Create a new client (admin only)
router.post("/",  clientController.createClient);

// Get all clients (admin only)
router.get("/", clientController.getClients);

// Get one client by ID (admin only)
router.get("/:id", clientController.getClient);

// Update a client by ID (admin only)
router.put("/:id",  clientController.updateClient);

// Delete a client by ID (admin only)
router.delete("/:id",  clientController.deleteClient);

module.exports = router;
