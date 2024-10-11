const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts
} = require("@jworkman-fs/asl");

exports.GetAllContacts = (req, res) => {
  const filtered = filterContacts(req.get("X-Filter-By"), req.get("X-Filter-Operator"), req.get("X-Filter-Value"));
  const sorted = sortContacts(filtered, req.query.sort, req.query.direction);
  const pager = new Pager(sorted, req.query.page, req.query.size);
  res.set("X-Page-Total", pager.total);
  res.set("X-Page-Next", pager.next());
  res.set("X-Page-Prev", pager.prev());

  res.status(200).json({
    contacts: pager.results()
  })
}

exports.GetContactById = (req, res) => {
  const { id } = req.params;
  const contact = ContactModel.show(id);
  res.status(200).json({
    contact
  })
}

exports.CreateContact = (req, res) => {
  const { fname, lname, email, phone, birthday } = req.body;
  try {
    ContactModel.create({fname, lname, email, phone, birthday});
    console.log(ContactModel.index());
    res.status(201).json({
      message: "Contact created!",
    })
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err
    })
  }
}

exports.UpdateContact = (req, res) => {
  const { id } = req.params;
  const { fname, lname, email, phone, birthday } = req.body;
  ContactModel.update(id, {fname, lname, email, phone, birthday})

  res.status(200).json({
    message: "success!"
  })
}

exports.DeleteContact = (req, res) => {
  const { id } = req.params;
  ContactModel.remove(id);
  res.status(200).json({
    message: "success!"
  })
}