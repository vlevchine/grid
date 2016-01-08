/**
 * Created by Vlad on 2015-10-21.
 */
'use strict';
var express = require('express'),
    app = new express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3040,
    appDir = __dirname;

app.set('port', port);
app.set('views', appDir);
app.use(express.static(appDir));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
var router = express.Router();
router.get('/sample', function(req, res) {
    res.json( JSON.parse(sample) );
});
app.use('/api', router);

//single entry point for web app
app.get('/', function(req, res) {
    var sender = req.ip|| req.connection.remoteAddress;
    res.render('index.ejs')
});

app.listen(app.get('port'));