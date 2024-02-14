import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "World",
    password: process.env.db_pass,
    port: 5432,
});

db.connect();

let quizBank = []
db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.error("Error executing query", err.stack0);
    } else {
        quizBank = res.rows;
    }
    db.end();
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let totalCorrect = 0;
let currentQuestion;

app.get("/", async (req, res) => {
    await nextQuestion();
    res.render("index.ejs", {
        totalScore: totalCorrect,
        countryName: currentQuestion
    });
}); 

app.post("/submit", (req, res) => {
    console.log("hello");
    res.render("index.ejs");
})

async function nextQuestion(){
    const randomCountry = quizBank[Math.floor(Math.random()*quizBank.length)].country;
    currentQuestion = randomCountry;
    console.log(randomCountry);
}

app.listen(port, () => {
    console.log(`Server is sucessfully running on port ${port}. Go to https://localhost:${port}`)
})
