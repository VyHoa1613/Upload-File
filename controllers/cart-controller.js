const express = require('express')
const app = express()

const shortid = require('shortid')
const db = require('../db')

module.exports.addCart = function(req, res)  {
    let id = req.signedCookies.sessionId
    let idProduct  = req.params.id
    if(!req.signedCookies.sessionId)
    {
        res.redirect('/')
        return;
    }
    let count = db.get('sessions').find({id:id}).get('cart.' + idProduct, 0).value()

    db.get('sessions')
        .find({id:id})
        .set('cart.' + idProduct, count + 1)
        .write()

    res.redirect('/')
}


module.exports.index = (req, res) => {
        let idSession = res.locals.sessionId;
        let cart =  db.get('sessions').find({id:idSession}).value()
        let books = db.get('books').value()
        let takeBooks = []
        if(!cart){
            res.render('cart/index',{
                carts:takeBooks
            })
            return; 
        }
        for(let i in cart.cart){
            
            books.map(function(item){
                let temp ={}
               if(item.id == i) {
                    temp.name = item.title
                    temp.image = item.image
                    temp.sl = cart.cart[i]
                    takeBooks.push(temp)
               }               
               return;
            })
        }
        res.render('cart/index',{
            carts:takeBooks
        })
}

module.exports.rent = (req, res) => {
    let idSession = res.locals.sessionId;
    if(req.signedCookies.userCookie)
    {
        let addUser = db.get("sessions").find({id:idSession}).set('idUser',req.signedCookies.userCookie).write()
        db.get('sessions').find({id:idSession}).unset('id').write()
        let books = db.get('books').value()
        for (let i in addUser.cart){
            let temp = {}
            books.map(function(item){
                if(item.id == i)
                {
                    temp.id = shortid.generate()
                    temp.idBook = i
                    temp.idName = addUser.idUser
                    temp.sl = addUser.cart[i]
                    db.get('transactions').push(temp).write()
                }
                return;
            })
        }
        db.get('sessions').remove({idUser:req.signedCookies.userCookie}).write()
        res.clearCookie('sessionId')
        res.redirect("/cart")
        return;
    }
    
    res.redirect('/cart')
}
