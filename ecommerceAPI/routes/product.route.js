const express = require('express')
const product = express.Router()

product.get('/products',(req,res,next)=>{
    res.send('The product list is showing');
})

product.post('/products',(req,res,next)=>{
    res.send('The product list is showing');
})

module.exports = product