const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

// ejs as templating engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

//setting params to use sessions
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: "top secret!",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// root route
app.get("/", function (req, res) {
   res.render("login", {"error":""});
});

app.get("/admin", function(req, res){
  if (req.session.authenticated) {
    res.render("admin");
  } else {
    res.redirect("/");
  }
});

app.post("/login", async function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  console.log("username:" + username);
  console.log("password:" + password);

  let hashedPwd = "$2a$10$Zr7WyM2tGnm3rIL0rgC5GelS9FCGkWz0ZmzfZBRCi.I5wx0oSgogW";

  let pwdMatch = await bcrypt.compare(password, hashedPwd);

  if (pwdMatch) {
    req.session.authenticated = true;
    res.render("home"); 
  } else {
    res.render("login", {"error":"wrong credentials"});
  }
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