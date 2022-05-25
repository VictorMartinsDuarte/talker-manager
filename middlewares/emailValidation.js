const emailValidation = (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  const regex = ('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
  const validateEmail = (eml) => String(eml).toLowerCase().match(regex);
  if (!validateEmail(email)) {
    res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

module.exports = emailValidation;