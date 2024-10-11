const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts,
  validateContactData
} = require("@jworkman-fs/asl");

exports.GetAllContacts = async (req, res) => {
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

exports.GetContactById = async (req, res) => {
  const { id } = req.params;
  const contact = ContactModel.show(id);
  res.status(200).json({
    contact
  })
}

exports.CreateContact = async (req, res) => {
  const { fname, lname, email, phone, birthday } = req.body;
  try {
    validateContactData({fname, lname, email, phone, birthday});
    ContactModel.create({fname, lname, email, phone, birthday});
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

exports.UpdateContact = async (req, res) => {

}

exports.DeleteContact = async (req, res) => {

}