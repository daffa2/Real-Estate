//configure a default route / default message (just to see that the server is working)
module.exports = function (app) {

    app.get('/', function (req, res) {
        var mesg = "Yay";
        res.json(mesg);
    });

}
