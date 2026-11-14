const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error.issues) {
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: formattedErrors[0]?.message || "Validation failed",
          errors: formattedErrors,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid request payload",
      });
    }
  };
};

module.exports = validate;