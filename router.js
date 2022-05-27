const express = require('express');
const fs = require('fs').promises;
const tokenGenerator = require('./utils/tokenGenerator');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');
const reqAuthentication = require('./middlewares/reqAuth');
const bodyValidation = require('./middlewares/bodyValidation');

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

router.post('/talker', reqAuthentication, bodyValidation, async (req, res, next) => {
  try {
    const { name, age, talk } = req.body;
    const data = await fs.readFile(jsonData, 'utf-8');
    const tklist = JSON.parse(data);
    const id = tklist.length + 1;
    const talker = { id, name, age, talk };
    tklist.push(talker);
    // Referência writeFile: https://www.geeksforgeeks.org/node-js-fs-writefile-method/
    fs.writeFile(jsonData, JSON.stringify(tklist));
    res.status(201).json(talker);
  } catch (error) {
    next(error);
  }
});

router.delete('/talker/:id', async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonData, 'utf-8');
    const tklist = JSON.parse(data);
    const { id } = req.params;
    const tkIndex = tklist.indexOf((tk) => tk.id === id);
    const newTklist = () => {
      if (tkIndex >= 0) {
        return tklist.splice(tkIndex, 1);
      }
      return res.status(400).send();
    };
    console.log(tkIndex);
    // console.log(newTklist());
    // fs.writeFile(jsonData, JSON.stringify(newTklist));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;