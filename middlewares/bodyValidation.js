const nameValidation = (name) => {
  if (!name) {
    console.log('sem nome');
    return { message: 'O campo "name" é obrigatório' };
  }
  if (name.length < 3) {
    console.log('nome menor que 3');
    return { message: 'O "name" deve ter pelo menos 3 caracteres' };
  }
};

const ageValidation = (age) => {
  if (!age) {
    return { message: 'O campo "age" é obrigatório' };
  }
  if (age < 18) {
    return { message: 'A pessoa palestrante deve ser maior de idade' };
  }
};

const invalidTalkMessage = { 
  message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
};

const talkWatchedAtValidation = (watchedAt) => {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!watchedAt) return invalidTalkMessage;
  if (!regex.test(watchedAt)) {
    return { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };
  }
};

const talkRateValidation = (rate) => {
  if (!rate) return invalidTalkMessage;
  if (rate < 1 || rate > 5) {
    return { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };
  }
};

const messages = (name, age, watchedAt, rate) => {
  if (nameValidation(name)) nameValidation(name);
  if (ageValidation(age)) ageValidation(age);
  if (watchedAt) {
    return talkWatchedAtValidation(watchedAt);
  }
  return talkRateValidation(rate);
};

const bodyValidation = (req, res, next) => {
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  if (!nameValidation(name) || !ageValidation(age)
  || !talkWatchedAtValidation(watchedAt) || !talkRateValidation(rate)) {
    res.status(400).json(messages(name, age, watchedAt, rate));
  }
  next();
};

module.exports = bodyValidation;