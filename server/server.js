/******************************************************************
** import modules
******************************************************************/
var url = require('url');
var http = require('http');
var express = require('express');
var zerorpc = require("zerorpc");
var bodyParser = require('body-parser');

/******************************************************************
** IP:Port constants
******************************************************************/
var rpc_client_ip = "127.0.0.1";
var rpc_client_port = 2424;
var http_server_port = 8080;

/******************************************************************
** Connect / bind server settings
******************************************************************/
var app = express();
var router = express.Router();
var rpc_client = new zerorpc.Client();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
rpc_client.connect("tcp://" + rpc_client_ip + ":" + rpc_client_port.toString());
server.listen(http_server_port);

/******************************************************************
** App changing security / functionality
******************************************************************/
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/******************************************************************
** Define API calls
******************************************************************/
router.route('/hello/:name').get(function(request, response) {
    rpc_client.invoke("hello", request.params.name, function(error, rpc_response, more) {
        response.json({"url": "/api/hello/:name", "data": rpc_response});
    });
});


/******************************************************************
** All API calls need the "/api" prefix
******************************************************************/
app.use('/api', router);
