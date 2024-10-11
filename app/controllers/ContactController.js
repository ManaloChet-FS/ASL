const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts
} = require("@jworkman-fs/asl");

exports.GetAllContacts = (req, res) => {
  try {
    const filtered = filterContacts(req.get("X-Filter-By"), req.get("X-Filter-Operator"), req.get("X-Filter-Value"));
    const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
    const pager = new Pager(sorted, req.query.page, req.query.limit);
    res.set("X-Page-Total", pager.total);
    res.set("X-Page-Next", pager.next());
    res.set("X-Page-Prev", pager.prev());

    const results = pager.results();

    res.status(200).json(results)
  } catch (err) {
    switch (err.name) {
      case "InvalidEnumError":
        return res.status(400).json({message: err.message})
      case "PagerOutOfRangerError":
        return res.status(416).json({message: err.message})
      default:
        return res.status(500).json({message: err.message})
    }
  }
}

exports.GetContactById = (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || id % 1 !== 0) {
      const err = new Error(`${id} is not a valid ID`);
      err.name = "InvalidIDError";
      throw err;
    }

    const contact = ContactModel.show(id);

    console.log(contact.fname, contact.lname);
    res.status(200).json(contact)
  } catch (err) {
      switch(err.name) {
        case "InvalidIDError":
          return res.status(400).json({message: err.message})
        case "ContactNotFoundError":
          return res.status(404).json({message: err.message})
        default:
          return res.status(500).json({message: err.message})
      }
  }
}

exports.CreateContact = (req, res) => {
  const { fname, lname, email, phone, birthday } = req.body;
  console.log(req.body);
  try {
    const newContact = ContactModel.create({fname, lname, email, phone, birthday});
    res.status(303).redirect(303, `/v1/contacts/${newContact.id}`)
  } catch (err) {
    console.log(err.name, err.message);
    switch (err.name) {
      case "InvalidContactFieldError":
      case "InvalidContactSchemaError":
        return res.status(400).json({message: err.message});
      default:
        return res.status(500).json({message: err.message});
    }
  }
}

exports.UpdateContact = (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id) || id % 1 !== 0) {
      const err = new Error(`${id} is not a valid ID`);
      err.name = "InvalidIDError";
      throw err;
    }

    const { fname, lname, email, phone, birthday } = req.body;
    ContactModel.update(id, {fname, lname, email, phone, birthday})

    res.status(303).redirect(303, `/v1/contacts/${id}`);
  } catch (err) {
    switch (err.name) {
      case "InvalidIDError":
      case "InvalidContactFieldError":
      case "InvalidContactSchemaError":
        return res.status(400).json({message: err.message});
      case "ContactNotFoundError":
        return res.status(404).json({message: err.message})
      default:
        return res.status(500).json({message: err.message});
    }
  }
}

exports.DeleteContact = (req, res) => {
  try {
    const { id } = req.params;
  
    if (isNaN(id) || id % 1 !== 0) {
      const err = new Error(`${id} is not a valid ID`);
      err.name = "InvalidIDError";
      throw err;
    }
  
    ContactModel.remove(id);
    res.status(303).redirect(303, "/contacts");
  } catch (err) {
    switch (err.name) {
      case "InvalidIDError":
        return res.status(400).json({message: err.message})
      case "ContactNotFoundError":
        return res.status(404).json({message: err.message})
      default:
        return res.status(500).json({message: err.message})
    }
  }
}