var mysql = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
               res.json({"Message" : "ak 7/15 -- Livestream Coding Challenge"});
               });
    router.post("/users",function(req,res){
                var query = "INSERT INTO ??(??,??) VALUES (?,?)";
                var table = ["livestream","full_name","dob",req.body.full_name,md5(req.body.dob)];
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                                 if(err) {
                                 res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                                 } else {
                                 res.json({"Error" : false, "Message" : "Director Added"});
                                 }
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