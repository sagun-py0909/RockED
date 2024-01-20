const express = require("express");
const sequelize = require("sequelize");
const { users, course } = require("./models");
const path = require("path");
const bodyparser = require("body-parser");
const internal = require("stream");
const { errorMonitor } = require("events");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.get("/", (request, response) => {
  if (request.accepts("html")) {
    response.render("index");
  }
});
app.get("/login", (request, response) => {
  if (request.accepts("html")) {
    response.render("user-login");
  }
});
app.get("/signup", (request, response) => {
  if (request.accepts("html")) {
    response.render("user-signup");
  }
});

app.post("/user-login", async (request, response) => {
  try {
    let { userName, password } = request.body;
    const userData = await users.findOne({
      where: {
        username: userName,
        password: password,
      },
    });
    if (userData) {
      console.log(userData);
      response.redirect(
        `/user-home-page?userName=${encodeURIComponent(userData.userName)}`
      );
    } else {
      console.log("not found");
      response.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
});
//post request success
app.post("/user-signup", async (request, response) => {
  let { firstName, lastName, userName, email, password } = request.body;
  try {
    const data = await users.create({
      firstName: firstName,
      lastName: lastName,
      username: userName,
      email: email,
      password: password,
    });
    if (userData) {
      console.log(userData);
      response.redirect(
        `/user-home-page?userName=${encodeURIComponent(userData.username)}`
      );
    } else {
      console.log("not found");
      response.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.log(error);
    response.status(500).send("internal Server error");
  }
});
app.get("/user-home-page", async (request, response) => {
  const userName = request.query.userName;
  try {
    const data = await course.findAll();
    if (data) {
      response.render("user-home-page", { userName, data });
    }
  } catch (error) {
    response.status(403);
    console.log(error);
  }
});
app.get("/user-profile", (request, response) => {
  // should add the athentication to dbms for the data.
  const userName = "something untill i get the dbms";
  const properties = { phone: "8237593589", email: "sagunvarm@fgil.com" }; //use users.findAll method to reqtrieve the data from database
  console.log(userName);
  response.render("user-profile", { userName, properties });
});
app.get("/courses", async (request, response) => {});
app.post("/create-course", async (request, response) => {
  let { name, creatorId, description } = request.body;
  try {
    const course = await course.create({
      name: name,
      creatorId: creatorId,
      description: description,
    });
    response.status(200).send(course);
  } catch (error) {
    response.status(500).send("internal server error");
    console.log(error);
  }
});

app.delete("/courses/:id", async (request, response) => {
  const { creatorId } = request.body;
  const courseId = request.params.id;

  try {
    const data = await course.destroy({
      where: {
        id: courseId,
        creatorId: creatorId,
      },
    });

    if (data) {
      response.sendStatus(200);
    } else {
      response.status(422).json({ error: "Failed to delete" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
