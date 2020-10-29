const express = require('express')
const app = express()

require('dotenv').config()
var cloudinary = require('cloudinary').v2;

cloudinary.config(process.env.CLOUDINARY_URL)

const shortid = require('shortid')
const db = require('../db')

module.exports.index = (req, res) => {
    let q = req.query.q
    let books = db.get('books').value()
    let takeBooks = books.filter(function(item) {
        return item.title.indexOf(q) != -1
    })

    let page = parseInt(req.query.page) || 1;
    let perPage = 5
    let start = (page - 1) * perPage
    let end = page * perPage

    if(!q)
    {       
        res.render('books/book', {
            books:books.slice(start,end)
        })
        return;
    }
    res.render('books/book', {
        books:takeBooks.slice(start,end),
        quest:q
    })
}

module.exports.postCreateBook = async (req,res) => {
    req.body.id = shortid.generate()
    let image = await cloudinary
                    .uploader
                    .upload(req.file.path,{
                        folder:'images'
                    } ,function(error, result) { 
                        return result
                    })  
    req.body.image = image.secure_url
    db.get('books').push(req.body).write()
    res.redirect('/books')
}

module.exports.getCreateBook = (req, res) => {
    res.render('books/create')
}


module.exports.getUpdateBook =  (req, res) => {
    let id = req.params.id
   res.render('books/update', {
       book:db.get('books').find({id: id}).value()
   })
}

module.exports.postUpdateBook = async (req, res) => {
    let id = req.body.id
    let image = await cloudinary
                    .uploader
                    .upload(req.file.path,{
                        folder:'images'
                    } ,function(error, result) { 
                        return result
                    })  
    req.body.image = image.secure_url
    let book = req.body
    if(!db.get('books').find({id: id}).value().image)
    {
        db.get('books').find({id: id}).set({image:book.image})
    }
    db.get('books').find({id: id})
        .assign({title:book.title, description: book.description, image: book.image})
        .write()
    res.redirect('/books')
}


module.exports.getDeleteBook = (req, res) =>{
    let id = req.params.id
    db.get('books').remove({id:id}).write()
    res.redirect("/books")
}