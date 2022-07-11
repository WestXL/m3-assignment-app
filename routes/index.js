const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Registratioin = mongoose.model('Registration');
const path = require('path');
const auth = require('http-auth');
const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

const {
    check,
    validationResult
} = require('express-validator');

router.get('/', function (req, res) {
    res.render('form', {
        title: 'Registratioin form'
    });
});

router.post('/', [
    check('name').isLength({
        min: 1
    }).withMessage('Please enter a name'), check('email').isLength({
        min: 1
    }).withMessage('Please enter an email'),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const registration = new Registratioin(req.body);
        registration.save()
            .then(() => {
                res.send('Thank you for your registration!');
            })
            .catch((err) => {
                console.log(err);
                res.send('Sorry! Something went wrong.');
            });
    } else {
        res.render('form', {
            title: 'Registration form',
            errors: errors.array(),
            data: req.body,
        });
    }
});

router.get('/registrations', basic.check((req, res) => {
    Registratioin.find()
        .then((registrations) => {
            res.render('index', {
                title: 'Listing registrations',
                registrations
            });
        })
        .catch(() => {
            res.send('Sorry! Something went wrong.')
        });
}));

module.exports = router;