const { Planet, Star } = require("../models");
const fs = require('fs');
const path = require('path');
const {
  validateId
} = require("../utils/validateData");

// Show all resources
const index = async (req, res) => {
  try {
    // Grabs the Content-Type header
    const contentType = req.get('Content-Type');
    const planets = await Planet.findAll({
      include: [{
        model: Star,
        through: {
          attributes: []
        }
      }],
    });

    // Checks if Content-Type is application/json
    if (contentType === "application/json") {
      return res.status(200).json(planets);
    }

    res.render('planets/index.twig', { planets });
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
    const planet = await Planet.findByPk(req.params.id, {
      include: [{
        model: Star,
        through: {
          attributes: []
        }
      }]
    });

    if (userAgent.includes('curl')) {
      return res.status(200).json(planet);
    }

    res.render("planets/show.twig", { planet });
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

    // Checks if an image is being uploaded
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join('public', 'images', image.name);

      // Moves the image into the /public/images folder
      await image.mv(uploadPath);

      // The path that the img tag will use to access the image
      imagePath = `/images/${image.name}`;
    }

    // Checks if "none" is selected on form
    if (req.body.StarId === "") {
      // An empty string is not accepted for StarId so needs to be changed to null
      req.body.StarId = null;
    }

    const planet = await Planet.create({...req.body, image: imagePath});

    if (req.body.StarId) {
      const star = await Star.findByPk(req.body.StarId);
      await star.addPlanet(planet.id);
    }

    res.redirect(302, `/planets/${planet.id}`);
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
    const planet = await Planet.findByPk(req.params.id);
    const previousStar = planet.StarId;

    let imagePath = planet.image;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join('public', 'images', image.name);

      // Checks if the planet has an image already
      if (planet.image) {
        const oldImage = path.join('public', planet.image);
        // Checks if the old image still exists
        if (fs.existsSync(oldImage)) {
          // Deletes the old image
          fs.unlinkSync(oldImage);
        }
      }

      await image.mv(uploadPath);

      imagePath = `/images/${image.name}`;
    }

    if (req.body.StarId === "") {
      req.body.StarId = null;
    }

    await Planet.update({...req.body, image: imagePath}, { where: { id: req.params.id } });

    if (req.body.StarId !== null) {
      const star = await Star.findByPk(req.body.StarId);
      await star.addPlanet(planet.id);
    } else {
      const star = await Star.findByPk(previousStar);
      if (star) {
        await star.removePlanet(planet.id);
      }
    }
    res.redirect(302, `/planets/${req.params.id}`);
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
  
    const planet = await Planet.findByPk(id);

    if (planet.image) {
      const image = path.join('public', planet.image);
      if (fs.existsSync(image)) {
        fs.unlinkSync(image);
      }
    }

    const stars = await Star.findAll({ where: { PlanetId: id } });

    for (const star of stars) {
      await star.update({ PlanetId: null });
    }

    await planet.destroy();

    res.redirect(302, '/planets')
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
  const stars = await Star.findAll({
    attributes: ['id', 'name']
  });
  if (req.params.id) {
    const planet = await Planet.findByPk(req.params.id);
    res.render('planets/_form.twig', { planet, stars });
  } else {
    res.render('planets/_form.twig', { stars });
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove, form }
