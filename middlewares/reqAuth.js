const reqAuthentication = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    console.log(authorization);
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

module.exports = reqAuthentication;