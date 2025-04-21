const mongoose = require("mongoose");
const initData = require("./data.js");
const Bookswap = require("../models/bookswap.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/bookswap";

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=> console.log(err));


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Bookswap.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner : '66bf3df27975739c1b4d2b13'}));
    await Bookswap.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();