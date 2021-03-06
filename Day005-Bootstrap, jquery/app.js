var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var xlsx = require('xlsx');


// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


app.use('/js', express.static(__dirname + '/node_modules/bootstrap-filestyle/src'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage});
var cpUpload = upload.fields([
    {name: 'excel', maxCount: 1}
]);

app.post('/upload', function (req, res) {
    cpUpload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file." + err);
        }
        readExcel(req.files.excel);
        res.end('upload successfully');
    });
});

function readExcel(excel) {
    var workbook = xlsx.readFile('./' + excel[0].path);

    var first_sheet_name = workbook.SheetNames[0];
    var address_of_cell = 'A1';

    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];

    /* Find desired cell */
    var desired_cell = worksheet[address_of_cell];

    /* Get the value */
    var desired_value = desired_cell.v;

    console.log(desired_value);
    console.log(xlsx.utils.sheet_to_json(worksheet));
    var json = xlsx.utils.sheet_to_json(worksheet);
    var p;
    for (p in json) {
        console.log(json[p]);
        console.log(json[p].product);
        console.log(json[p].price);
    }
};


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
