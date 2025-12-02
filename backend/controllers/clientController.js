const Client = require("../models/Client");

module.exports = {
  // -------------------------------
  // CREATE CLIENT
  // -------------------------------
  async createClient(req, res) {
    try {
      const client = await Client.create(req.body);
      res.json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // GET ALL CLIENTS
  // -------------------------------
  async getClients(req, res) {
    try {
      const clients = await Client.find().sort({ createdAt: -1 });
      res.json(clients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // GET ONE CLIENT
  // -------------------------------
  async getClient(req, res) {
    try {
      const client = await Client.findById(req.params.id);

      if (!client)
        return res.status(404).json({ message: "Client not found" });

      res.json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // UPDATE CLIENT
  // -------------------------------
  async updateClient(req, res) {
    try {
      const client = await Client.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!client)
        return res.status(404).json({ message: "Client not found" });

      res.json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // -------------------------------
  // DELETE CLIENT
  // -------------------------------
  async deleteClient(req, res) {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);

      if (!client)
        return res.status(404).json({ message: "Client not found" });

      res.json({ message: "Client deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
