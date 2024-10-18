const { Galaxy, Star } = require("../models");
const {
  validateId,
  validateResource,
  validateInput
} = require("../utils/validateData");

// Show all resources
const index = async (req, res) => {
  try {
    const galaxies = await Galaxy.findAll({
      include: Star
    });
    // Respond with an array and 2xx status code
    res.status(200).json(galaxies);
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

    const galaxy = await Galaxy.findByPk(id, {
      include: Star
    })
    validateResource(id, galaxy);

    // Respond with a single object and 2xx code
    res.status(200).json(galaxy)
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

    await Galaxy.create({ name, size, description });
    // Issue a redirect with a success 2xx code
    res.redirect(201, `/galaxies`)
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
  
    const galaxy = await Galaxy.update({ name, size, description }, { where: { id } });
    // Respond with a single resource and 2xx code
    res.status(200).json(`/galaxies/${req.params.id}`)
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
  
    const galaxy = await Galaxy.destroy({ where: { id } });
    validateResource(galaxy);
  
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
