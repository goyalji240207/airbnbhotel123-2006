const express=require("express");
const app = express();
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/airbnb"

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi, I am root.");
});

const initDB = async ()=>{
     await Listing.deleteMany({});
     await Listing.insertMany(initData.data);
     console.log("data was initialized");
};

initDB();