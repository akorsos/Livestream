var mysql = require("mysql");
var request = require("request");
var express = require("express");
var http = require("http");
var md5 = require("md5");


function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        res.json({"Message" : "ak 7/15 -- Livestream Coding Challenge"});
    });
    
    //Insert director
    router.post("/directors",function(req,res){
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
                        res.json({"Error" : false, "Message" : "User added: " +fullname+ " ID: " +id});
                        console.log("User added: " +fullname+ " ID: " +id);
                    }
                });
            });
        });
    });
    
    //Return all directors
    router.get("/directors",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["livestream"];
        
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Directors" : rows});
                console.log("Returned all directors");
            }
    
        });
    });
    
    //Remove a director
    router.delete("/directors",function(req,res){
        var id = req.body.livestream_id;

        var query = "DELETE from ?? WHERE ??=?";
        var table = ["livestream","livestream_id",id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "No such user"});
            } else {
                res.json({"Error" : false, "Message" : "User removed with ID: " +id});
                console.log("User removed ID: " +id);
            }
        });
    });
    
    //Edit a director
    router.put("/directors",function(req,res){
        var id = req.body.livestream_id;
        var favCam = req.body.favorite_camera;
        var favMovies = req.body.favorite_movies;
               
        var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?"
        var table = ["livestream","favorite_camera",favCam,"favorite_movies",favMovies,"livestream_id",id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "No such user"});
            } else {
                res.json({"Error" : false, "Message" : "User updated ID: " +id});
                console.log("User updated: " +id);
            }
        });
    });
    
}

module.exports = REST_ROUTER;