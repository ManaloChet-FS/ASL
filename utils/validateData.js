const validateId = (id) => {
  if (isNaN(id) || id % 1 !== 0) {
    const error = new Error(`${id} is not a valid ID!`);
    error.name = "InvalidIdError";
    throw error;
  }
}

const validateResource = (id, resource) => {
  if (resource === null || resource === 0) {
    const error = new Error(`Resource with an ID of ${id} was not found!`);
    error.name = "ResourceNotFound";
    throw error;
  }
}

const validateInput = (name, size, description) => {
  let error = new Error();
  error.name = "InvalidInputError";

  if (!isNaN(parseInt(name))) {
    error.message = `${name} is not a valid name. Must be a string.`;
    throw error;
  }

  if (isNaN(size)) {
    error.message = `${size} is not a valid size. Must be an integer.`;
    throw error;
  };

  if (!isNaN(parseInt(description))) {
    error.message = `${description} is not a valid description. Must be text.`;
    throw error;
  }
}

module.exports = {
  validateId,
  validateResource,
  validateInput
}