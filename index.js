require('dotenv').config()

const { PORT } = process.env
const port = PORT || 3000;

const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const Edusign = require("./models/Edusign")

const { REACT_APP_EDUSIGN_TOKEN } = process.env

console.log(REACT_APP_EDUSIGN_TOKEN)

app.use(morgan("tiny"))
app.use(cors())

app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin:admin@cluster0.zjt5k.mongodb.net/test")
const db = mongoose.connection

db.on("error", (err) => console.log(err))
db.once("open", () => console.log("connected to db"))

app.get('/', async (req, res) => {
  try {
    const data = await Edusign.findById("61e0105374efbca54f45527c").exec()
    console.log(data)
    res.json(data)
  } catch (err) {
    console.log("get datas error")
    console.log(err)
  }
})

app.listen(port, process.env.HOST, () => {
  console.log(`Server running on port ${port}`)
})