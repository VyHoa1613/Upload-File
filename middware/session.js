const express = require('express')
const app = express()

const shortid = require('shortid')
const db = require('../db')

module.exports = function(req, res, next) {
    if(!req.signedCookies.sessionId)
    {
        let sessionId = shortid.generate()
        res.cookie('sessionId', sessionId, {signed: true})
        db.get('sessions').push({id:sessionId}).write()
        res.redirect('/')
        return;
    }
    res.locals.sessionId = req.signedCookies.sessionId
    let  sessionName = db.get('sessions').find({id:req.signedCookies.sessionId}).value()
    let items = 0
    let count = 0
    for (let i in sessionName)
    {
        count += 1;
    }
    if(count > 1)
    {
        for (let i in sessionName.cart)
        {
            items += sessionName.cart[i];
        }
    }
    res.locals.items = items

    next();
}