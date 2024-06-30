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
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6681494bba192bb16a2d1d35",
  }));
  await listing.insertMany(initdata.data);
  console.log("data was initialised");
};

initDB();
