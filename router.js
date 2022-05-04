const express = require('express');
const { nextTick } = require('process');
const fs = require('fs').promises;

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

module.exports = router;