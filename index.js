require("dotenv").config();
const express = require('express');
const nodemailer = require("nodemailer");
const { default: axios } = require("axios");
const CronJob = require("cron").CronJob;

const app = express();
const port = process.env.PORT || 3000;

const email = ["simplyarsa15@gmail.com", "not_arsalan@outlook.com"]
const api_url ="https://zenquotes.io/api/today/";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
});

async function getapi(url)
{
    const response = await axios.get(url);
    const data = response.data;
    return data;
}

async function main() {
  // send mail with defined transport object
  let data = await getapi(api_url);
  const info = await transporter.sendMail({
    from: '"Arsalan" <arsalanrizvi07@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Good Morning :)", // Subject line
    html: data[0].h, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

const cronMail = new CronJob("0 0 14 * * *", async () => {
    console.log("Sending message....")
    await main().catch(console.error);
});

cronMail.start();

app.get('/', async (req, res) => {
    const data = await getapi(api_url);
    res.send(data[0].h);
});

app.get("/time", (req, res) => {
    let d = new Date()
    let h = d.getHours()
    let m = d.getMinutes()
    console.log(h, m)
    res.send(`Time is ${h} ${m}`);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});