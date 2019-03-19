require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect('mongodb://localhost/jwt', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('open', () => {
    console.log(`Connected to Mongo on ${db.host}: ${db.port}`)
})
db.on('error', (err) => {
    console.log(`Database error:\n${err}`)
})

app.get('/', (req, res) => {
    res.send("You hit the root route");
})

app.use('/auth', require('./routes/auth'))

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`You're listening to the sweet sounds of ${process.env.EXPRESS_PORT} jwt-authorization in the morning...`)
    console.log(`Oh, and the port is`, process.env.EXPRESS_PORT)
})