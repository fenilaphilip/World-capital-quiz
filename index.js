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

let quizBank = [];
let countryFlags = [];
db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
        console.error("Error executing query", err.stack);
    } else {
        quizBank = res.rows;
    }

    db.query("SELECT * FROM flags", (err, res) => {
        if (err) {
            console.error("Error executing query", err.stack);
        } else {
            countryFlags = res.rows;
        }
        db.end();
    });
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let totalCorrect;
let currentQuestion;
let isAnswerCorrect;

app.get("/", async (req, res) => {
    totalCorrect = 0;
    isAnswerCorrect = true;
    await nextQuestion();
    res.render("index.ejs", {
        totalScore: totalCorrect,
        countryName: currentQuestion,
        rightAnswer: isAnswerCorrect
    });
});

app.post("/submit", (req, res) => {
    let answer = req.body.answer.trim();
    if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
        totalCorrect++;
        nextQuestion();
        console.log(`score: ${totalCorrect}`);
        res.render("index.ejs", {
            totalScore: totalCorrect,
            countryName: currentQuestion,
            rightAnswer: isAnswerCorrect
        });
    } else {
        isAnswerCorrect = false;
        res.render("index.ejs", {
            totalScore: totalCorrect,
            rightAnswer: isAnswerCorrect,
            countryName: currentQuestion
        });
    }
});

app.post("/restart", (req, res) => {
    res.redirect("/");
});

async function nextQuestion() {
    const randomCountry = quizBank[Math.floor(Math.random() * quizBank.length)];
    if (randomCountry.capital === null) {
        nextQuestion();
    };
    currentQuestion = randomCountry;
    console.log(currentQuestion);
};

app.listen(port, () => {
    console.log(`Server is sucessfully running on port ${port}. Go to https://localhost:${port}`)
});
