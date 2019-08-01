require("dotenv").config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authCtrl = require('./authController')
const {PORT, CONNECTION_STRING, SECRET} = process.env


const app = express()

app.use(express.json())
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: SECRET
    })
)

app.post(`/auth/register`, authCtrl.register)

massive(CONNECTION_STRING).then(db =>{
    app.set('db', db)
    app.listen(PORT, ()=> console.log(`its port ${PORT} BITCH`))
})