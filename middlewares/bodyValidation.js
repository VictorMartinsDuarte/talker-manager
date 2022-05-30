const invalidTalkMessage = { 
  message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
};
const regex = /^\d{2}\/\d{2}\/\d{4}$/;
const messageName = { message: 'O "name" deve ter pelo menos 3 caracteres' };
const messageAge = { message: 'A pessoa palestrante deve ser maior de idade' };
const messageWatchedat = { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' };
const messageRate = { message: 'O campo "rate" deve ser um inteiro de 1 à 5' };

const isNameAndAgeValid = (name, age) => {
  if (!name || !age) {
    return true;
  }
};

const isTalkValid = (talk) => {
  if (!talk) return true;
};

const isFilled = (name, age, talk) => {
  const { watchedAt, rate } = talk;
  if (!name) return ({ message: 'O campo "name" é obrigatório' });
  if (!age) return ({ message: 'O campo "age" é obrigatório' });
  if (!watchedAt) return invalidTalkMessage;
  if (!rate) return invalidTalkMessage;
};

const rateValidation = (rate) => rate < 1 || rate > 5;
const talkValidation = (name, age, { watchedAt, rate }) => {
  if (name.length < 3) return messageName;
  if (age < 18) return messageAge;
  if (!regex.test(watchedAt)) return messageWatchedat;
  if (rateValidation(rate)) return messageRate;
  return false;
};

const watchedAtAndRateValidation = (talk) => {
  const { watchedAt, rate } = talk;
  if (watchedAt && rateValidation(rate)) return false;
  if (!watchedAt) return true;
  if (!rate) return true;
  return false;
};

const bodyValidation = (req, res, next) => {
  const { name, age, talk } = req.body;
  const talkValid = isTalkValid(talk);
  if (talkValid) return res.status(400).json(invalidTalkMessage);
  if (isNameAndAgeValid(name, age) || watchedAtAndRateValidation(talk)) {
    return res.status(400).json(isFilled(name, age, talk));
  }
  if (talkValidation(name, age, req.body.talk)) { 
    return res.status(400).json(talkValidation(name, age, req.body.talk));
  }
  next();
};

module.exports = bodyValidation;