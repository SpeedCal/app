import 'dotenv/config';
import cors from 'cors';
import express from 'express';
//import puppeteer from "puppeteer"

const puppeteer = require('puppeteer')
const handlebars = require('handlebars')

const app = express();
let browser;

app.use(cors());

app.get('/', async (req, res) => {
  console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  await page.screenshot({path: 'example.png'});

  res.send('Hello World!');
});

app.listen(process.env.API_PORT, () => {
  browser = await puppeteer.launch()
  console.log(`Example app listening on http://localhost:${process.env.API_PORT}`),
});
