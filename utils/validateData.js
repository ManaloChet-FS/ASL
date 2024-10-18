const validateId = (id) => {
  // Checks if ID is not a number or not an integer
  if (isNaN(id) || id % 1 !== 0) {
    const error = new Error(`${id} is not a valid ID!`);
    error.name = "InvalidIdError";
    throw error;
  }
}

const validateResource = (id, resource) => {
  // Checks if the resource doesn't exist
  if (resource === null || resource === 0) {
    const error = new Error(`Resource with an ID of ${id} was not found!`);
    error.name = "ResourceNotFound";
    throw error;
  }
}

const validateInput = (name, size, description) => {
  let error = new Error();
  error.name = "InvalidInputError";

  // Checks if the name isn't a string
  if (!isNaN(parseInt(name))) {
    error.message = `${name} is not a valid name. Must be a string.`;
    throw error;
  }

  // Checks if size is not a number
  if (isNaN(size)) {
    error.message = `${size} is not a valid size. Must be an integer.`;
    throw error;
  };

  // Checks if the description is not a string
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