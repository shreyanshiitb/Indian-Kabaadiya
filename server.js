const express = require('express')
const router = express.Router()

const app = express()
const bodyParser = require('body-parser')
const db = require('./app/db')
const Phrases = require('./app/models/phrases')
const Rates = require('./app/models/rates')
const config = require('./config')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/app/views')
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/css", express.static(__dirname + '/css'))
app.use("/js", express.static(__dirname + '/js'))
app.use("/img", express.static(__dirname + '/img'))
app.use("/font-awesome", express.static(__dirname + '/font-awesome'))
app.use("/fonts", express.static(__dirname + '/fonts'))

db.connect('mongodb://'+config.db.user+':'+config.db.password+'@'+config.db.host+':'+config.db.port, function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        app.listen(config.app.port, function () {
            console.log('Listening on port 3000...')
        })
        app.get('/', function (req, res) {
            var data = {}
            Phrases.all(function (err, docs) {
                data.phrases = docs
                Rates.all(function (err, docs) {
                    data.rates = docs
                    res.render('kabaad', { data: data })
                })
            })
        })
        app.get('/create-phrase', function (req, res) {
            res.render('create-phrase')
        })
        app.get('/create-rate', function (req, res) {
            res.render('create-rate')
        })
        app.post('/save-phrase', (req, res) => {
            Phrases.save(req.body)
            res.redirect('/create-phrase')
        })
        app.post('/save-rate', (req, res) => {
            Rates.save(req.body)
            res.redirect('/create-rate')
        })
    }
})