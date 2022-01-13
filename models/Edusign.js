const { Schema, model } = require("mongoose")

const EdusignSchema = Schema({
  courses: Object,
  students: Object,
  ranks: Object
})

const Edusign = model("Edusign", EdusignSchema)

module.exports = Edusign
