const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

 const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then((res) => {
    console.log("connected to db")
})
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB = async () =>{
    await Listing.deleteMany({});

     initData.data = initData.data.map((obj) => ({...obj , owner:'67e6a26533891a1efa692c6d'}));
    await Listing.insertMany(initData.data);
     console.log("data was initalized");
}

initDB();