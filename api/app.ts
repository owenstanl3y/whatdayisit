import express from 'express'
import bodyParser from 'body-parser'
import DB from './db';
import router from './router'

const app = express()

app.use(bodyParser.json())
app.use('/admin', async function checkUser(req, res, next) {
  const apiKey = req.query.api_key;
  if(!apiKey){
    return res.status(400).send({
      status: "failed",
      data:"Missing Api Key"
    });
  }
  const b = await DB.isVaild(apiKey)
  if (b) {
    next();
  } else {
    return res.status(400).send({
      status: "failed",
      response: "Invalid Api Key"
    });
  }
})
app.use(router)

module.exports = app
