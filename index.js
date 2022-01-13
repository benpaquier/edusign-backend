const express = require("express")
const app = express()
const fs = require('fs')
const cors = require("cors")
const morgan = require("morgan")

app.use(morgan("tiny"))
app.use(cors())

app.get('/', (req, res) => {
  fs.readFile('./data.json', (err, data) => {
    res.json(JSON.parse(data))
  })
})

app.listen(5000, () => {
  console.log(`Server running on port 5000`)
})