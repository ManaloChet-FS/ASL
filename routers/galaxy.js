// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const galaxyCtlr = require(`../controllers/galaxy.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// HTML5 Specific
router.get('/new', galaxyCtlr.form)
router.get('/:id/edit', galaxyCtlr.form)
router.get('/:id/delete', galaxyCtlr.remove)
router.post('/:id', galaxyCtlr.update)

// RESTful resource mappings
router.get(`/`, galaxyCtlr.index)
router.post(`/`, galaxyCtlr.create)
router.get(`/:id`, galaxyCtlr.show) 
router.put(`/:id`, galaxyCtlr.update) 
router.delete(`/:id`, galaxyCtlr.remove) 

// export "router"
module.exports = router
