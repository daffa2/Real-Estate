var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
mongoose.connect('mongodb://David:qwe123qwe@ds047622.mongolab.com:47622/mother_real_estate');

var Estate = require('./app/models/estate');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 8080);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {

    console.log('Something is happening.');
    next();
});

app.get('/', function (req, res) {
    var mesg = "Yay"
    res.json(mesg);
});

app.post('/estate', function (req, res) {

    var estate = new Estate({
        Price: req.body.Price,
        LookingFor: req.body.LookingFor,
        RoomsNumber: req.body.RoomsNumber,
        Area: req.body.Area,
        PropertyType: req.body.PropertyType,
        Desc: req.body.Desc,
        photos: []
    });
    //save mongoose
    estate.save(function (err) {
        if (err)
            res.send(err);

        res.json({
            _id: estate._id
        });
    });
});

app.post('/uploadPhoto', function (req, res) {

    var photo = {
        _id: req.body._id,
        base64: req.body.base64
    };

    Estate.findById(photo._id, function (err, estate) {

        if (err)
            res.send(err);

        estate.photos.push(photo.base64);

        estate.save(function (err) {
            if (err)
                res.send(err);

            res.json({
                message: 'estate updated!'
            });
        });

    });

});


app.get('/estate', function (req, res) {
    Estate.find({}, function (err, estates) {
        if (err)
            res.send(err);

        res.json(estates);
    });
});

app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
