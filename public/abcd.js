//make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var nick = document.getElementById('nick'),
    btna = document.getElementById('send'),
    btnb = document.getElementById('belo'),
    btnc = document.getElementById('celo'),
    btnd = document.getElementById('delo'),
    odpb = document.getElementById('odpb'),
    odpc = document.getElementById('odpc'),
    odpd = document.getElementById('odpd'),
    odpa = document.getElementById('odpa');

// emit events
btna.addEventListener('click', function(){
    socket.emit('abcd', {
        nick: nick.value,
        answer: 'A'
    });
});

btnb.addEventListener('click', function(){
    socket.emit('abcd', {
        nick: nick.value,
        answer: 'B'
    });
});

btnc.addEventListener('click', function(){
    socket.emit('abcd', {
        nick: nick.value,
        answer: 'C'
    });
});

btnd.addEventListener('click', function(){
    socket.emit('abcd', {
        nick: nick.value,
        answer: 'D'
    });
});

//listen for events
socket.on('abcd', function(data){
    if (data.nick) {
        if (data.answer=="A"){
            odpa.innerHTML += "<p>"+data.nick+"</p> <br/>";
        } else if (data.answer=="B"){
            odpb.innerHTML += "<p>"+data.nick+"</p> <br/>";
        } else if (data.answer=="C"){
            odpc.innerHTML += "<p>"+data.nick+"</p> <br/>";
        } else if (data.answer=="D"){
            odpd.innerHTML += "<p>"+data.nick+"</p> <br/>";
        }
    }
});