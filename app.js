const express = require('express');
const app = express();
const port = 3000;
const goodsRouter = require('./routes/goods.js');

const mongoose = require('mongoose') 

mongoose
.connect("mongodb://127.0.0.1:27017/spa_mall")
.then(() => console.log("몽고디비 연결 완료")) 
.catch(err => console.log(err));

app.use(express.json());

app.use('/api', goodsRouter,);


app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});