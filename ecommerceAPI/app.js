const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const createError = require('http-errors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

require('dotenv').config()
const _env = process.env

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/ecommerce')
.then(() => {console.log('Mongo DB connected') })
.catch((error) => { console.log(`Mongo DB error ${error}`) })

const productRoute = require('./routes/product.route')
const categoryRoute = require('./routes/category.route')

app.use('/category',categoryRoute)

app.use((req,res,next) => {
    next(createError(404, 'Not found the End Point'))
})
app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status || 500,
            message: err.message
        }
    })
})

app.listen(_env.PORT,() => {
    console.log(`APP is ruuning on PORT ${_env.PORT}`)
})




