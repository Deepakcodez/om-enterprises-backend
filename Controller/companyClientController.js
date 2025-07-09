const  companyClient  = require("../models/companyClientModel.js");  

// Add a new client
async function addClient(req, res) {
  const { name, rating, comment } = req.body;
  const imageUrl = req.imageUrl;

  if (!name || !rating || !comment || !imageUrl) {
    return res.status(400).json({
      msg: "All fields are required",
    });
  }

  try {
    const newClient = new companyClient({
      img: imageUrl,
      companyName: name,
      rating,
      comment,
    });

    if (!newClient) {
      return res.status(400).json({
        msg: "Something went wrong",
      });
    }

    await newClient.save();
    res.status(201).json({
      msg: "Client added successfully",
      newClient,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

// Remove a client by ID
async function removeClient(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      msg: "Client ID is required",
    });
  }

  try {
    const deletedClient = await companyClient.findByIdAndDelete(id);

    if (!deletedClient) {
      return res.status(404).json({
        msg: "Client not found",
      });
    }

    res.status(200).json({
      msg: "Client removed successfully",
      deletedClient,
    });
  } catch (error) {
    console.error("Error removing client:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

// Update a client by ID
async function updateClient(req, res) {
  const { name, rating, comment } = req.body;
  const imageUrl = req.imageUrl; // New image URL if uploaded

  try {
    // Find the client by ID
    const client = await companyClient.findById(req.params.id);

    if (!client) {
      return res.status(404).json({
        msg: "Client not found",
      });
    }

    // Update fields if they are present in the request
    client.companyName = name || client.companyName;
    client.rating = rating || client.rating;
    client.comment = comment || client.comment;
    client.img =
      imageUrl ||
      client.img ||
      "https://res.cloudinary.com/debzdd4wk/image/upload/v1739874524/uploads/c5mkudqjhknjuvzvyvsk.png"; // Use new image if uploaded, else keep old

    await client.save();

    res.status(200).json({
      msg: "Client updated successfully",
      client,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

// Get all clients
async function getClients(req, res) {
  try {
    const clients = await companyClient.find();

    if (!clients || clients.length === 0) {
      return res.status(200).json({
        msg: "No clients found",
        clients: [],
      });
    }

    res.status(200).json({
      msg: "Clients fetched successfully",
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

// Get a single client by ID
async function getClientById(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      msg: "Client ID is required",
    });
  }

  try {
    const client = await companyClient.findById(id);

    if (!client) {
      return res.status(404).json({
        msg: "Client not found",
      });
    }

    res.status(200).json({
      msg: "Client fetched successfully",
      client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

module.exports = { addClient, removeClient, updateClient, getClients, getClientById };
