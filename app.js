
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
mongoose.connect('mongodb://root:root$toor@172.16.102.42:27017/pedidos_hospi');
// all environmentss
app.set('port', process.env.PORT ||3000 );
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  //res.render('layout.jade');
  res.writeHead(400,{'content-type':'text/html'});
  res.write('<!doctype html><html><head><meta charset="utf-8"><title>CGH-Nodejs</title><style>body{background:#2f2f2f;background:-moz-radial-gradient(center,ellipse cover,#2f2f2f 0%,#1b1b1b 100%);background:-webkit-gradient(radial,center center,0px,center center,100%,color-stop(0%,#2f2f2f),color-stop(100%,#1b1b1b));background:-webkit-radial-gradient(center,ellipse cover,#2f2f2f 0%,#1b1b1b 100%);background:-o-radial-gradient(center,ellipse cover,#2f2f2f 0%,#1b1b1b 100%);background:-ms-radial-gradient(center,ellipse cover,#2f2f2f 0%,#1b1b1b 100%);background:radial-gradient(ellipse at center,#2f2f2f 0%,#1b1b1b 100%);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="#2f2f2f",endColorstr="#1b1b1b",GradientType=1);background-repeat:no-repeat;background-size:cover;background-attachment:fixed}</style></head><body><center><div style="height:150px;"></div><img src="images/node_logo.png"style="vertical-align:middle"><div style="height:200px;"></div><img src="images/logo_white.png"></div></center></body></html>');
  res.end();
});


var server =http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var r_pedidos = mongoose.model('cantidad_pedidos', 
                { 
                 id_personal: String,
 		 sede: String,
                 fecha:String,
                 estado:String
                });

var pedido = '';

var io = require('socket.io').listen(server);
var allClients = []; 

//io.set('close timeout',0);
//io.set('heartbeat timeout',0);

io.sockets.on('connection', function (socket) {
allClients.push(socket);
socket.on('disconnect',function(){
	console.log('xx');
	var i = allClients.indexOf(socket);
	delete allClients[i];
});
socket.on('setPseudo', function (data) {
  socket.set('pseudo', data);
});

socket.on('aumentar_pedido', function (message,v_id_personal,v_sede,v_fecha,v_tipo,v_nomhab) {
       data = { sede : v_sede , tipo:v_tipo,nom_hab:v_nomhab };
       socket.broadcast.emit("aumentar_pedido",data);
});
socket.on('disminuir_pedido',function(v_piso){
	data = {piso:v_piso};
	socket.broadcast.emit('disminuir_pedido',data);
});
socket.on('dispensar_farmacia',function(a){
	socket.broadcast.emit('dispensar_farmacia',a);
});

socket.on('hh_sol',function(a){
	socket.broadcast.emit('hh_sol',a);
});

socket.on('paes',function(a){
	socket.broadcast.emit('paes',a);
});

socket.on('amb',function(a){
	socket.broadcast.emit('amb',a);
});

socket.on('cred_pisos',function(a){
	socket.broadcast.emit('cred_pisos',a);
});

socket.on('cred_pisos3',function(a){
	socket.broadcast.emit('cred_pisos3',a);
});

socket.on('alta',function(a){
	socket.broadcast.emit('alta',a);
});

socket.on('fin_farmacia',function(a){
	socket.broadcast.emit('fin_farmacia',a);
});

socket.on('nueva_interc',function(a){
	socket.broadcast.emit('nueva_interc',a);
});

socket.on('farmacia_hosp',function(a){
	socket.broadcast.emit('farmacia_hosp',a);
});
socket.on('tv.enfermeras',function(piso,tipo){
	data_tv = { d_piso:piso ,d_tipo:tipo };
	socket.broadcast.emit('tv.enfermeras',data_tv);
});

socket.on('imprimir',function(a){
	socket.broadcast.emit('datos',a);
});


});
