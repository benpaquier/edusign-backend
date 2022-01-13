const mongoose = require("mongoose")
const Edusign = require("../models/Edusign")

mongoose.connect("mongodb+srv://admin:admin@cluster0.zjt5k.mongodb.net/test")
const db = mongoose.connection

db.on("error", (err) => console.log(err))
db.once("open", () => console.log("connected to db"))

const job = async () => {
  try {
    const data = await Edusign.findOneAndUpdate(
      { _id: "61e0105374efbca54f45527c" },
      {
        data: {
          hello: "hello"
        }
      },
      { new: true }
    )
    
    console.log(data)
  } catch (error) {
    console.log("err update")
    console.log(error)
  }
}

job()