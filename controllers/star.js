const { Star, Planet, Galaxy } = require("../models");
const fs = require('fs');
const path = require('path');
const {
  validateId
} = require("../utils/validateData");

// Show all resources
const index = async (req, res) => {
  try {
    const contentType = req.get('Content-Type');
    const stars = await Star.findAll({
      include: [{
        model: Planet,
        through: {
          attributes: []
        },
        Galaxy
    }]
    });

    if (contentType === "application/json") {
      return res.status(200).json(stars);
    }

    res.render('stars/index.twig', { stars });
  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}

// Show resource
const show = async (req, res) => {
  try {
    validateId(req.params.id);

    const userAgent = req.get('user-agent');
    const star = await Star.findByPk(req.params.id, {
      include: [
      {
        model: Planet,
        through: {
          attributes: []
        }
      },
      {
        model: Galaxy,
        required: false
      }
    ]
    });

    if (userAgent.includes('curl')) {
      return res.status(200).json(star);
    }

    res.render("stars/show.twig", { star });
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
    let imagePath = null;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join('public', 'images', image.name);

      await image.mv(uploadPath);

      imagePath = `/images/${image.name}`;
    }

    if (req.body.PlanetId === "") {
      req.body.PlanetId = null;
    }

    const star = await Star.create({...req.body, image: imagePath});

    if (req.body.PlanetId) {
      const planet = await Planet.findByPk(req.body.PlanetId);
      await planet.addStar(star.id);
    }

    res.redirect(302, `/stars/${star.id}`);
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
    validateId(req.params.id);
    const star = await Star.findByPk(req.params.id);
    const previousPlanet = star.PlanetId;

    let imagePath = star.image;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join('public', 'images', image.name);

      if (star.image) {
        const oldImage = path.join('public', star.image);
        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }

      await image.mv(uploadPath);

      imagePath = `/images/${image.name}`;
    }

    if (req.body.GalaxyId === "") {
      req.body.GalaxyId = null;
    }

    if (req.body.PlanetId === "") {
      req.body.PlanetId = null;
    }

    await Star.update({...req.body, image: imagePath}, { where: { id: req.params.id } });

    if (req.body.PlanetId !== null) {
      const planet = await Planet.findByPk(req.body.PlanetId);
      await planet.addStar(star.id);
    } else {
      const planet = await Planet.findByPk(previousPlanet);
      if (planet) {
        await planet.removeStar(star.id);
      }
    }

    res.redirect(302, `/stars/${req.params.id}`);
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
  
    const star = await Star.findByPk(id);

    if (star.image) {
      const image = path.join('public', star.image);
      if (fs.existsSync(image)) {
        fs.unlinkSync(image);
      }
    }

    const planets = await Planet.findAll({ where: { StarId: id } });

    for (const planet of planets) {
      await planet.update({ StarId: null });
    }

    await star.destroy();
  
    res.redirect(302, '/stars')
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

const form = async (req, res) => {
  const galaxies = await Galaxy.findAll({
    attributes: ['id', 'name']
  });
  const planets = await Planet.findAll({
    attributes: ['id', 'name']
  });
  if (req.params.id) {
    const star = await Star.findByPk(req.params.id);
    res.render('stars/_form.twig', { star, galaxies, planets });
  } else {
    res.render('stars/_form.twig', { galaxies, planets });
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove, form }
