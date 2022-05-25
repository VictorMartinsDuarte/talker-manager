const random = () => Math.random().toString(16).substr(2);

const tokenGenerator = () => {
  const token = (random() + random()).substr(1, 16);
  return token;
};

module.exports = tokenGenerator;