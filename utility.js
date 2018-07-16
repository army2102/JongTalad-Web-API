module.exports = {
  createError: (statusCode = 404, error, res) => {
    res.status(statusCode).json({
      code: res.statusCode,
      error,
      response: null
    });
  },

  createResponse: (statusCode = 200, responseBody, res) => {
    res.status(statusCode).json({
      code: res.statusCode,
      error: null,
      response: responseBody
    });
  }
};
