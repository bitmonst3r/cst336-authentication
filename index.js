const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

// ejs as templating engine
app.set('view engine', 'ejs');

//setting params to use sessions
app.use(session({
  secret: "top secret!",
  resave: true,
  saveUninitialized: true
}));

// root route
app.get("/", function (req, res) {
  res.render("index");
});

// Tests if DB is connected
app.get("/dbTest", async (req, res) => {
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);
  res.send(rows);
});//dbTest

// Functions
async function executeSQL(sql, params){
  return new Promise (function (resolve, reject) {
    pool.query(sql, params, function (err, rows, fields) {
      if (err) throw err;
        resolve(rows);
    });
  });
}//executeSQL

function dbConnection(){
   const pool = mysql.createPool({
      Host: "u3r5w4ayhxzdrw87.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      User: "egolyub8c6uqn3h7",
      Password: "bawg468ex0o83xu6",
      Database: "yptykv9puaie0t38",
      Port: "3306"
   }); 
   return pool;

} //dbConnection

// Start sever, set up for deployment in Heroku 
app.listen(process.env.PORT || 5000, () => {
console.log("Expresss server running...")
} )