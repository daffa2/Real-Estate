//loads mongoose object
var Estate = require('../app/models/estate');

module.exports = function (app) {

    //get all estates from DB
    app.get('/estate', function (req, res) {
        Estate.find({}, function (err, estates) {
            if (err)
                res.send(err);

            res.json(estates);
        });
    });

    //post a new estate , make a new mongoose obj and insert it into the DB.
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

        //save to mongoose
        estate.save(function (err) {
            if (err)
                res.send(err);

            res.json({
                _id: estate._id
            });
        });
    });


}
