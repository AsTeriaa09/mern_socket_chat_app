const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    //console.log(err)
    const Status = 400;
    const message = err.errors[0].message;
     const extraDetails = "Fill the input with correct informations";
    const error = { Status,message, extraDetails };
    //res.status(400).json({ error });
    next(error);
  }
};

module.exports = validate;
