const { Galaxy, Star } = require("../models");
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
    const galaxies = await Galaxy.findAll({
      include: Star
    });

    // Checks if Content-Type is application/json
    if (contentType === "application/json") {
      return res.status(200).json(galaxies);
    }

    res.render('galaxies/index.twig', { galaxies });
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
    const galaxy = await Galaxy.findByPk(req.params.id, {
      include: Star
    });

    if (userAgent.includes('curl')) {
      return res.status(200).json(galaxy);
    }

    res.render("galaxies/show.twig", { galaxy });
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

    const galaxy = await Galaxy.create({...req.body, image: imagePath});
    res.redirect(302, `/galaxies/${galaxy.id}`);
  } catch (err) {
    switch (err.name) {
      case "InvalidInputError":
        return res.status(400).json({ message: err.message });
      default:
        return res.status(500).json({ message: err.message });
    }
  }
}

const update = async (req, res) => {
  try {
    validateId(req.params.id);
    const galaxy = await Galaxy.findByPk(req.params.id);

    let imagePath = galaxy.image;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadPath = path.join('public', 'images', image.name);

      // Checks if the galaxy has an image already
      if (galaxy.image) {
        const oldImage = path.join('public', galaxy.image);
        // Checks if the old image still exists
        if (fs.existsSync(oldImage)) {
          // Deletes the old image
          fs.unlinkSync(oldImage);
        }
      }

      await image.mv(uploadPath);

      imagePath = `/images/${image.name}`;
    }

    await Galaxy.update({...req.body, image: imagePath}, { where: { id: req.params.id } });
    res.redirect(302, `/galaxies/${req.params.id}`);
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
  
    const galaxy = await Galaxy.findByPk(id);

    if (galaxy.image) {
      const image = path.join('public', galaxy.image);
      if (fs.existsSync(image)) {
        fs.unlinkSync(image);
      }
    }

    const stars = await Star.findAll({ where: { GalaxyId: id } });

    for (const star of stars) {
      await star.update({ GalaxyId: null });
    }

    await galaxy.destroy();
  
    res.redirect(302, '/galaxies');
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
  if (req.params.id) {
    const galaxy = await Galaxy.findByPk(req.params.id);
    res.render('galaxies/_form.twig', { galaxy });
  } else {
    res.render('galaxies/_form.twig');
  }
}

// Export all controller actions
module.exports = { index, show, create, update, remove, form }
