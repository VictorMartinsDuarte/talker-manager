const express = require('express');
const fs = require('fs').promises;
const tokenGenerator = require('./utils/tokenGenerator');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');

const router = express.Router();

const jsonData = './talker.json';

router.get('/talker', async (_req, res, next) => {
  try {
    const data = await fs.readFile(jsonData, 'utf-8');
    return res.status(200).json(JSON.parse(data));
  } catch (error) {
    next(error);
  }
});

router.get('/talker/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonData, 'utf-8');
    const tkList = JSON.parse(data);
    const id = +req.params.id;
    const talker = tkList.find((tkr) => tkr.id === id);
    console.log(talker);
    if (talker) {
      return res.status(200).json(talker);
    }
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', emailValidation, passwordValidation, (_req, res) => {
  res.status(200).json({ token: tokenGenerator() });
});

module.exports = router;