const express = require('express')
const app = express()

const shortid = require('shortid')
const db = require('../db')

module.exports.index = (req, res) => {
    let books = db.get('books').value()
    let page = parseInt(req.query.page) || 1;
    let perPage = 8
    let start = (page - 1) * perPage
    let end = page * perPage
    res.render('books/products', {
        books:books.slice(start,end)
    })
}