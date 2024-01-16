const express = require("express")
const sequelize = require("sequelize")
const {Users} = require("./models")
const path = require("path")
const bodyparser = require("body-parser")
const internal = require("stream")
const app = express()
app.set("view engine" , "ejs")
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.get("/", (request , response ) =>{
  if(request.accepts("html")){
    response.render("index")
  }
})
app.get("/login", (request , response ) =>{
  if(request.accepts("html")){
    response.render("user-login")
  }
})
app.get("/signup", (request , response ) =>{
  if(request.accepts("html")){
    response.render("user-signup")
  }
})

app.post("/user-login" , (request , response)=>{
  let {userName , password} = request.body
  console.log(userName)
  console.log(password)
  response.redirect(`/user-home-page?userName=${encodeURIComponent(userName)}`);

})
//post request success
app.post("/user-signup" , async (request , response)=>{
  let {firstName , lastName , userName , email , password} = request.body
  try {
    const data = await Users.create({
    firstName:firstName,
    lastName:lastName,
    userName:userName,
    email:email,
    password:password
  })
  if(data){
    response.status(200)
    response.json(data)
  }
  } catch (error) {
    console.log(error)
    response.status(500).send("internal Server error")
  }
  

})
app.get("/user-home-page" , (request , response)=>{
  const userName = request.query.userName
  response.render("user-home-page" ,{userName} )
})
app.get("/user-profile" , (request , response)=>{
  // should add the athentication to dbms for the data.
  const userName = "something untill i get the dbms"
  const properties =  {phone:"8237593589" , email:"sagunvarm@fgil.com" }//use Users.findAll method to reqtrieve the data from database
  console.log(userName);
  response.render("user-profile" ,{userName , properties} )
})
module.exports = app