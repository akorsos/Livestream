var mysql = require("mysql");
var request = require("request");
var express = require("express");
var http = require("http");


function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "ak 7/15 -- Livestream Coding Challenge"});
    });
    
    router.post("/users",function(req,res){
        var fullname, birth;
                
        //Get ID from POST
        var id = req.body.livestream_id;
                
        http.get({
            host: 'api.new.livestream.com',
            path: '/accounts/' + id
            }, function(response) {
            //Update stream with data
            var body = '';
            
            response.on('data', function(d) {
                body += d;
            });
            
            response.on('end', function() {
                var parsed = JSON.parse(body);
                fullname = parsed.full_name;
                birth = parsed.dob;
                                     
                var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
                var table = ["livestream","livestream_id","full_name","dob",id,fullname,birth];
                        query = mysql.format(query,table);
                        
                connection.query(query,function(err,rows){
                    if(err) {
                        res.json({"Error" : true, "Message" : "No such user or user already exists"});
                    } else {
                        res.json({"Error" : false, "Message" : "User added"});
                        console.log("User added: " +fullname+ " ID: " +id);
                    }
                });
            });
        });
    });
    
    router.get("/users",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["livestream"];
        
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Directors" : rows});
            }
    
        });
    });
    
    
}

module.exports = REST_ROUTER;