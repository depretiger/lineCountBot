const express = require('express')
const path = require('path')
const fs = require('fs')
const PORT = process.env.PORT || 5000
const line = require('@line/bot-sdk')

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.SECRET_KEY
};
const client = new line.Client(config);

express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')

    .get('/', (req, res) => res.render('pages/index'))
    .get('/g/', (req, res) => res.json({method: 'こんにちは、getさん'}))
    .post('/p/', (req, res) => res.json({method: 'こんにちは、postさん'}))
    .post('/hook/', line.middleware(config), (req, res) => lineBot(req, res))

    .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    function lineBot(req, res) {
        res.status(200).end();
        const events = req.body.events;
        const promises = [];
        for (let i = 0, l = events.length; i < l; i++) {
            const ev = events[i];
            promises.push(
                kazoerukun(ev)
            )
        }
    }

    async function kazoerukun(ev) {
        const isCountOn = fs.readFileSync('public/isCountOn.txt')
        if (ev.message.text == 'かぞえて') {
            switchMode(ev, 'on')
        } else if (ev.message.text == 'やめて') {
            switchMode(ev, 'off')
        } else if (isCountOn == 'true') {
            return client.replyMessage(ev.replyToken, {
                type: 'text',
                text: `${ev.message.text.length}もじ`
            })
        }
    }

    function switchMode(ev, mode) {
        if (mode == 'on') {
            fs.writeFileSync('public/isCountOn.txt', 'true')
            return client.replyMessage(ev.replyToken, {
                type: 'text',
                text: `かぞえるよ`
            })
        }else if (mode == 'off') {
            fs.writeFileSync('public/isCountOn.txt', 'false')
            return client.replyMessage(ev.replyToken, {
                type: 'text',
                text: `やめるよ`
            })
        }
    }





