const express = require("express")
const app = express()

const job = require("./jobs/edusign")

job.start()

app.listen(5000, () => {
  console.log(`Server running on port 5000`)
})