// necessary packages
const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

// create express server
const app = express();

// server ports (heroku and local)
const PORT = process.env.PORT || 3000;

// set ejs template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

// info needed to parse html for POST request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

// routes
app.get("/", (req, res) => {
    res.render("index")
})
app.get("/singleuse", (req, res) => {
    res.render("singleuse");
});
app.get("/library", (req, res) => {
    res.render("library");
});

app.post("/", (req, res) => {

})

// start server
app.listen(PORT, () =>{
    console.log(`Server started on port ${PORT}`);
})