const express = require('express')
const app = express()

const shortid = require('shortid')
const db = require('../db')

module.exports.index = (req, res) => {
    let tran = db.get('transactions').value()
    let takeInfo = tran.map(function(item){
        return{
            user:db.get('users').find({id:item.idName}).value().name,
            book:db.get('books').find({id:item.idBook}).value().title,
            id:item.id,
            sl:item.sl
        }
    })
    res.render('transactions/index', {
        info:takeInfo
    })
}

module.exports.postTranUpdate = (req, res) =>{
    let id = req.body.id
    db.get('transactions').find({id:id}).assign({idName: req.body.idName, idBook: req.body.idBook,sl:req.body.sl}).write()
    res.redirect('/transactions')
}

module.exports.getTranUpdate = (req, res) =>{
    let id = req.params.id
    value = db.get('transactions').find({id:id}).value()
    let info = {}
    for (let i in value)
    {
        info = {
            id:i.id,
            idName:i.idName,
            sl:i.sl,
            idBook:i.idBook,
            user:users.find(function(item){
                item.id == i.idName
                return item.name
            }),
            book:books.find(function(item){
                item.id == i.idName
                return item.title
            })
        }
    }
    res.render('/transactions/:id/update',{
        info:info
    })
}

module.exports.getTranCreate = (req, res) => {
    let users = db.get('users').value()
    let books = db.get('books').value()
    res.render('transactions/create',{
        users:users,
        books:books
    })
}

module.exports.postTranCreate = (req, res) =>{
    req.body.id = shortid.generate()
    db.get('transactions').push(req.body).write()
    res.redirect('/transactions')
}



module.exports.deleteTran = (req, res) =>{
    let id = req.params.id
    db.get('transaction').remove({id:id}).write()
    res.redirect('/transactions')
}