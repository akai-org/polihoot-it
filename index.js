var express= require('express');

var app=express();
var server=app.listen(4000,fuction(){
    console.log('listening to request on port 4000')
});