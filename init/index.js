// const mongoose = require("mongoose");
// const initdata = require("./data.js");
// const Listing = require("../models/listings.js");


// const Mongo_Url ='mongodb://127.0.0.1:27017/wanderlust';


// main()
// .then(()=>{
//     console.log("connection Succesful")
// }).catch((err)=>{
//     console.log("error found in the connection of db");
// })

// async function main(){
//     await mongoose.connect(Mongo_Url)
// }

// const initDb = async ()=>{
//     await Listing.deleteMany({})
//     await Listing.insertMany(initdata.data);
//     console.log("Data was intialized");
// } 

// initDb();


const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");

const Mongo_Url ='mongodb://127.0.0.1:27017/wanderlust';

async function main(){
    await mongoose.connect(Mongo_Url);
    console.log("connection Succesful");
}

const initDb = async ()=>{
    await Listing.deleteMany({});
     initdata.data =  initdata.data.map((obj)=>({...obj,owner:"68f775d13e09c09cf5b35ba7"}))
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
} 

main()
.then(()=> initDb())
.catch((err)=> console.log("error found in the connection of db", err));
