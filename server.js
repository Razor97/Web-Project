var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var bcrypt = require('bcrypt');
var mysql = require('mysql');

function server_connect() //function will authenticate with the server and return a connection object
{
      var pool        = mysql.createPool({
      connectionLimit : 10, // default = 10
      host            : 'localhost',
      user            : 'root',
      password        : '',
      database        : 'steam'
  });
  //test connection
  return pool;
}


var pool = server_connect();//mysql connection object


// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

// for parsing multipart/form-data
app.use(upload.array());

app.use(express.static(__dirname + '/public'));


app.post('/loginAuth',function(req,res){
//convert password to hash and check for authentication
//no need to check if password is empty
  if(req.body.username.length!=0 && req.body.password.length!=0){
    pool.getConnection(function(err,conn){
    conn.query("SELECT PASSWORD FROM USERDETAILS WHERE USERNAME=?",[req.body.username],function(err,result){
    var qpassword = result.length>0?result[0].PASSWORD:"";
    bcrypt.compare(req.body.password,result[0].PASSWORD,function(err,r){
      if(r)
      {
        res.send("Success");
      }
      else {
        res.send("Error");
      }
    });

    });
    conn.release();
  });
}


}); //listen to http post message in the route /loginAuth



app.post('/register',function(req,res){
  //first check if username is a valid USERNAME

  pool.getConnection(function(err,conn){
    if(err) throw err;
    conn.query("SELECT USERNAME FROM USERDETAILS WHERE USERNAME=?",[req.body.username],function(err,result){
      if(err){throw err;conn.release();}
      if(result.length==0){
        console.log("waiting");
        //username is unique
        //go ahead and create an account for the username
        //ensure that front end checks if data is correct

        //generate hash of password


        bcrypt.hash(req.body.password,10,function(err,hash){
           conn.query("INSERT INTO USERDETAILS VALUES(?,?,?,?,?)",[req.body.username,hash,req.body.name,req.body.email,req.body.date],function(err,result){
            if(err){throw err;conn.release();}
            console.log("Insertion successful");
          });
        });



      }
    });
    conn.release();
  });
}); //listen for http post message for the url \register



var server=app.listen(8080,function() {
  console.log("Server running!running at port 8080");
});
