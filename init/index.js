const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
main()
  .then(() => {
    console.log("Connection Sucessfull✈️");
  })
  .catch((e) => {
    console.log(e);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Airbnb");
}

const initDB = async () => {
  await listing.deleteMany({});
  await listing.insertMany(initdata.data);
  console.log("data was initialised");
};

initDB();
