const router = require("express").Router();

const {
  GetAllContacts,
  GetContactById,
  CreateContact,
  UpdateContact,
  DeleteContact
} = require("../controllers/ContactController");

router.get("/", GetAllContacts);
router.get("/:id", GetContactById);
router.post("/", CreateContact);
router.put("/:id", UpdateContact);
router.delete("/:id", DeleteContact);

module.exports = router;