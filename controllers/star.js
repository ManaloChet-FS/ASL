const { Star, Planet, Galaxy } = require("../models");
const {
  validateId,
  validateResource,
  validateInput
} = require("../utils/validateData");

// Show all resources
const index = async (req, res) => {
  try {
    const stars = await Star.findAll({
      include: [
        {
          model: Planet,
          through: {
            attributes: []
          }
        },
        Galaxy
      ]
    });
    // Respond with an array and 2xx status code
    res.status(200).json(stars);
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

    const star = await Star.findByPk(id, {
      include: [
        {
          model: Planet,
          through: {
            attributes: []
          }
        },
        Galaxy
      ]
    })
    validateResource(id, star);

    // Respond with a single object and 2xx code
    res.status(200).json(star)
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
    const { name, size, description, GalaxyId, PlanetId } = req.body;
    validateInput(name, size, description);

    const star = await Star.create({ name, size, description, GalaxyId, PlanetId });

    if (PlanetId) {
      const planet = await Planet.findByPk(PlanetId);
      await planet.addStar(star);
    }
    // Issue a redirect with a success 2xx code
    res.redirect(201, `/stars`)
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
  
    const { name, size, description, GalaxyId, PlanetId } = req.body;
    validateInput(name, size, description);
  
    await Star.update({ name, size, description, GalaxyId, PlanetId }, { where: { id } });
    // Respond with a single resource and 2xx code
    res.status(200).json(`/stars/${req.params.id}`)
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
  
    const star = await Star.destroy({ where: { id } });
    validateResource(star);
  
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
