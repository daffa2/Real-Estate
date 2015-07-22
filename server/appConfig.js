var bodyParser = require('body-parser');

module.exports = function (app, express) {

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());


    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    //Just for debug
    app.use(function (req, res, next) {
        console.log('Something is happening.');
        next();
    });

    app.use(express.static(__dirname + '/public'));
}
