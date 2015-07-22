var express = require('express'),
    app = express();

var Estate = require('./app/models/estate')
require('./appConfig.js')(app, express);

require('./routes/defaultRoute.js')(app);
require('./routes/estate.js')(app);
require('./routes/upload.js')(app);

var mongoose = require('mongoose');
mongoose.connect('mongodb://David:qwe123qwe@ds047622.mongolab.com:47622/mother_real_estate');

app.set('port', process.env.PORT || 8080);

app.listen(app.get('port'));
console.log('Magic happens on port ' + app.get('port'));
