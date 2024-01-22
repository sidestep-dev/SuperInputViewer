//imports
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

//port
const port = 3000;

//express features
const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//static assets
app.use(express.static("public"));
app.get("/script.js", (req, res) => {
	res.sendFile(__dirname, "public/script.js");
});

//routes
app.get("/", (req, res) => {
	res.render("index");
});

//start server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
