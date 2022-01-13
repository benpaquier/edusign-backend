require('dotenv').config();

const express = require("express")
const app = express()
const fs = require('fs')
const cors = require("cors")
const morgan = require("morgan")

app.use(morgan("tiny"))
app.use(cors())

app.use(express.static("public"))

app.get('/', (req, res) => {
  fs.readFile('./data.json', (err, data) => {
    res.json(JSON.parse(data))
  })
})

app.listen(3000, process.env.HOST, () => {
  console.log(`Server running on port 3000`)
})