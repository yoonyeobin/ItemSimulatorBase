import express from 'express';
import itemRouter from './routes/item.js';
import characterRouter from './routes/character.js';
import accountRouter from './routes/account.js';

const app = express();

const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!!');
});

app.use('/api', [itemRouter, characterRouter, accountRouter]);
