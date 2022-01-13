const { Schema, model } = require("mongoose")

const EdusignSchema = Schema({
  data: Object
})

const Edusign = model("Edusign", EdusignSchema)

module.exports = Edusign
