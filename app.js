if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



const dbUrl =  process.env.ATLASTDB_URL;

main()
.then((res) => {
    console.log("connected to db")
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(dbUrl);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },// See below for details
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in mongo sesion store" , err);
})

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized: true,
  cookie:{
   expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
   maxAge: 7 * 24 * 60 * 60 * 1000,
   httpOnly: true,
  }
}

// app.get("/",(req,res) =>{
//   res.send("hi, I am root");
// });



// app.use((req, res, next) => {
//   res.locals.currUser = req.user || null; // Assuming you're using Passport.js for authentication
//   next();
// });


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/",(req,res) =>{
//     res.send("hi, I am root");
// });


// app.get("/demouser", async (req,res) =>{
//   let fakeUser = new User({
//     email:"student@gamil.com",
//     username:"delta-student",
//   })

//  let registerUser  = await User.register(fakeUser,"helloworld");
//   res.send(registerUser);
// });


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
res.locals.currentUser = req.user;
  console.log(res.locals.success);
  next();
})

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));  // Create a new error with 404 status
});



app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Some error occurred" } = err;
  //res.status(statusCode).send(message);

  res.status(statusCode).render("error.ejs" , {message})
});

app.listen(8080 , () => {
 console.log("server is listening to port");
});




