const { Planet } = require("../models");
const {
  validateId,
  validateResource,
  validateInput
} = require("../utils/validateData");

// Show all resources
const index = async (req, res) => {
  try {
    const planets = await Planet.findAll();
    // Respond with an array and 2xx status code
    res.status(200).json(planets);
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

// Show resource
const show = async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);

    const planet = await Planet.findOne({ where: { id } })
    validateResource(id, planet);

    // Respond with a single object and 2xx code
    res.status(200).json(planet)
  } catch (err) {
    switch (err.name) {
      case "InvalidIdError":
        return res.status(400).json({ message: err.message });
      case "ResourceNotFound":
        return res.status(404).json({ message: err.message });
      default:
        return res.status(500).json({ message: err.message });
    }
  }
}

// Create a new resource
const create = async (req, res) => {
  try {
    const { name, size, description } = req.body;
    validateInput(name, size, description);

    await Planet.create({ name, size, description });
    // Issue a redirect with a success 2xx code
    res.redirect(201, `/planets`)
  } catch (err) {
    switch (err.name) {
      case "InvalidInputError":
        return res.status(400).json({ message: err.message });
      default:
        return res.status(500).json({ message: err.message });
    }
  }
}

// Update an existing resource
const update = async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
  
    const { name, size, description } = req.body;
    validateInput(name, size, description);
  
    const planet = await Planet.update({ name, size, description }, { where: { id } });
    // Respond with a single resource and 2xx code
    res.status(200).json(`/planets/${req.params.id}`);
  } catch (err) {
    switch (err.name) {
      case "InvalidInputError":
      case "InvalidIdError":
        return res.status(400).json({ message: err.message });
      case "ResourceNotFound":
        return res.status(404).json({ message: err.message });
      default:
        return res.status(500).json({ message: err.message });
    }
  }
}

// Remove a single resource
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    validateId(id);
  
    const planet = await Planet.destroy({ where: { id } });
    validateResource(planet);
  
    // Respond with a 2xx status code and bool
    res.status(204).json(true)
  } catch (err) {
    switch (err.name) {
      case "InvalidIdError":
        return res.status(400).json({ message: err.message });
      case "ResourceNotFound":
        return res.status(404).json({ message: err.message });
      default:
        return res.status(500).json({ message: err.message });
    }
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove }
