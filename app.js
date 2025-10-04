const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync");
const expressError=require("./utils/ExpressError");

const MONGO_URL="mongodb://127.0.0.1:27017/airbnb"

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi, I am root.");
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));

// new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

// show rout
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing})
}));

// create route
app.post("/listings",wrapAsync(async (req,res,next)=>{
    if(!req.nody.listing){
        throw ExpressError(400,"send valid data for listing");
    }
        let newListing=new Listing(req.body.listing);
        await newListing.save(); 
        res.redirect("/listings");
}));

// edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

// update route
app.put("/listing/:id",wrapAsync(async(req,res)=>{
     if(!req.nody.listing){
        throw ExpressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
}));

// delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calanguta, Goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })
app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong"}=err;
   res.status(statusCode).render("error.js",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to 8080");
});