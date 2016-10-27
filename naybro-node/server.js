var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var mysql = require('mysql');

mysqlCreds = {
                host: 'us-cdbr-iron-east-04.cleardb.net',
                port: '3306',
                user: 'bbfba85ddca87c',
                password: '615b4cbb',
                name: 'ad_c606dd2ec7e785d'
};

var express = require("express"),
    app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.VCAP_APP_PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.get("/hello", function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello WorldPPPP!\n");
});
//query by product name for populating the list


app.get('/name', function(req, res){
        var query = "select * from products where Name like '%" + req.query.productName + "%' ORDER BY rating DESC";    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not found');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });

});

//query by product id for getting info for the details page
app.get('/details', function(req, res){
        var query = "select * from products where Pid = "+ req.query.pid;    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not found');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});

//query by user id
app.get('/rentals', function (req, res) {
    var query = "select * from rentals where Uid1 = " + req.query.uid;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Notmeow found');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});

app.get('/rentals/posted', function (req, res) {
    var query = "select * from rentals where Uid2 = " + req.query.uid;
     connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not afound');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});


app.get('/uid', function(req, res){
        var query = "select * from users where Uid = "+ req.query.uid;    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not mfound');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});

app.get('/signup', function(req, res) {
                var usr = req.query.username;
                var query = "INSERT INTO users (Username) VALUES ('"+usr+"')";
                connection.query(query, function(err,rows) {
                                if (err) {
                                                console.log('Error: ' +err);
                                                res.status(404).json(err);
                                } else {
                                                res.json(rows);
                                }
                });
});

app.get('/user', function(req, res){
        var query = "select * from users where Username = '"+ req.query.username+"'";    connection.query(query, function(err, rows, fields) {

        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not kfound');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});

app.get('/request', function(req, res) {

                var date = new Date();
                var uid1 = req.query.uid1;
                var pid = req.query.pid;
                var hours = req.query.hours;
                var uid2 = req.query.uid2;
                date = date.toISOString();
                date= date.slice(0, 10)+" "+date.slice(11, 19);
                var query = "INSERT INTO rentals ( Uid1, Pid, status, initialTime, hoursRented, Uid2) VALUES ("+uid1+", "+pid+", 'requested', '"+date+"', "+hours+", "+uid2+")";
                connection.query(query, function(err,rows) {
                                if (err) {
                                                console.log('Error: ' +err);
                                                res.status(404).json(err);
                                } else {
                                                res.json(rows);
                                }
                });
});

//query by user id for getting the my rentals
app.get('/rentals', function(req, res){//
        var query = "select * , 'renter' from rentals where Uid1 = " + req.query.uid + " UNION select *, 'rentee' from rentals where Uid2 = " + req.query.uid + " ORDER BY initialTime DESC";    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not dfound');
        } else {
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', '["GET"]');
            res.json(rows);
        }
    });
});



/*app.get('/name', function(req, res){
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello WorldPPPP!\n");


    var query = "select * from products where Name like '%" + req.body.productName + "%' ORDER BY rating DESC";;
    connection.query(query, function(err, rows, fields) {
        if (err) {
            console.log('Error: ' + err);
            res.status(404).send('Not found');
        } else {
            //res.send(JSON.stringify(rows));
            res.set('Content-Type', 'application/json');
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Content-Type', '["GET"]');
            res.json(rows);
       }
});
});
*/
// connect to DB
var connection = mysql.createPool({
    connectionLimit : 10,
    host: mysqlCreds.host,
    port: mysqlCreds.port,
    user: mysqlCreds.user,  // not user
    password: mysqlCreds.password,
    database: mysqlCreds.name,
});

//connection.connect(function(){
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});





//users, products