const express = require('express');
const fs = require('fs').promises;
const tokenGenerator = require('./utils/tokenGenerator');
const emailValidation = require('./middlewares/emailValidation');
const passwordValidation = require('./middlewares/passwordValidation');
const reqAuth = require('./middlewares/reqAuth');
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

router.get('/talker/search', reqAuth, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonData, 'utf-8');
    const tkList = JSON.parse(data);
    // Referência req.query: https://pt.stackoverflow.com/questions/401582/a-diferen%C3%A7a-entre-req-params-e-req-query
    const { q } = req.query;
    const talkersFilter = tkList.filter(({ name }) => name.includes(q));
    console.log(q);
    console.log(talkersFilter);
    if (!talkersFilter) res.status(200).json([]);
    res.status(200).json(talkersFilter);
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

router.post('/talker', reqAuth, bodyValidation, async (req, res, next) => {
  try {
    const { name, age, talk } = req.body;
    const data = await fs.readFile(jsonData, 'utf-8');
    const tkList = JSON.parse(data);
    const id = tkList.length + 1;
    const talker = { id, name, age, talk };
    tkList.push(talker);
    // Referência writeFile: https://www.geeksforgeeks.org/node-js-fs-writefile-method/
    fs.writeFile(jsonData, JSON.stringify(tkList));
    res.status(201).json(talker);
  } catch (error) {
    next(error);
  }
});

router.put('/talker/:id', reqAuth, bodyValidation, async (req, res, next) => {
  try {
    const { name, age, talk } = req.body;
    const data = await fs.readFile(jsonData, 'utf-8');
    const tkList = JSON.parse(data);
    const id = +req.params.id;
    const tkIndex = tkList.indexOf((tk) => tk.id === Number(id));
    const modifiedTk = { id, name, age, talk };
    console.log(tkIndex);
    tkList.splice((tkIndex - 1), 1, modifiedTk);
    const newList = tkList;
    console.log(newList);
    await fs.writeFile(jsonData, JSON.stringify(newList));
    res.status(200).json(modifiedTk);
    // res.status(400).json({ message: 'Valores inválidos.' });
  } catch (error) {
    next(error);
  }
});

router.delete('/talker/:id', reqAuth, async (req, res, next) => {
  try {
    const data = await fs.readFile(jsonData, 'utf-8');
    const tkList = JSON.parse(data);
    const { id } = req.params;
    const newTkList = tkList.filter((tk) => tk.id !== Number(id));
    fs.writeFile(jsonData, JSON.stringify(newTkList));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;