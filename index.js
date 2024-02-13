import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"World",
    password: process.env.db_pass,
    port: 5432,   
});

db.connect();

let quiz = []
db.query("SELECT * FROM capitals", (err,res)=>{
    if(err){
        console.error("Error executing query", err.stack0);
    }else{
        quiz = res.rows;
    }
    db.end();
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let totalCorrect = 0;

app.get("/", (req,res)=>{
res.render("index.ejs", {
    totalScore: totalCorrect
});
});

app.post("/submit", (req,res)=>{
    console.log ("hello");
    res.render("index.ejs");
})

app.listen(port,()=>{
    console.log(`Server is sucessfully running on port ${port}. Go to https://localhost:${port}`)
})
