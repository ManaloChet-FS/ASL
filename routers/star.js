// Load in Express framework
const express = require(`express`)

// Load in our controller/action instances
const starCtlr = require(`../controllers/star.js`)

// Create a new Router instance and call it "router"
const router = new express.Router()

// HTML5 Specific
router.get('/new', starCtlr.form)
router.get('/:id/edit', starCtlr.form)
router.get('/:id/delete', starCtlr.remove)
router.post('/:id', starCtlr.update)

// RESTful resource mappings
router.get(`/`, starCtlr.index)
router.post(`/`, starCtlr.create)
router.get(`/:id`, starCtlr.show) 
router.put(`/:id`, starCtlr.update) 
router.delete(`/:id`, starCtlr.remove) 

// export "router"
module.exports = router
