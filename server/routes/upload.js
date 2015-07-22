//load mongoose objects
var Estate = require('../app/models/estate');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {

    //uploads a base64 photo to server than saves it to Db;
    app.post('/uploadPhoto', function (req, res) {

        var photo = {
            _id: req.body._id,
            base64: req.body.base64
        };

        Estate.findById(photo._id, function (err, estate) {

            if (err)
                res.send(err);

            estate.photos.push(photo.base64);

            //saves to the db
            estate.save(function (err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'estate updated!'
                });
            });

        });

    });

    //trying to get the file with middleware
    app.post('/image', multipartMiddleware, function (req, res) {
        var image = req.file;
        res.status(204).end()
    });

}
