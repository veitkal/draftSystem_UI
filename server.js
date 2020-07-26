/*
 * simple express server using websockets to be used with separate app relaying messages as OSC
 *
 */


const express = require('express');
const app = express();

// process.env.PORT for heroku
const server = app.listen(process.env.PORT || 3000, listen);

//info on host and port
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Listening at http://' + host + ':' + port);
}

//which folder to use, ie where index.html and scripts are
app.use(express.static('public'));


// WebSockets work with the HTTP server
const io = require('socket.io')(server);

//on connection callbac
io.sockets.on('connection',
  function (socket) {
  
    console.log("Client connected: " + socket.id);

    // when 'param' is recieved, emit to all others
    socket.on('param',
      function(data) {
        console.log("Received: 'param' " + " " + data.address + " " + data.val);
        // socket.broadcast.emit('param', data);
        io.sockets.emit('param', data);
      }
    );
    
    //when disconnect, do log
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
  }
);


