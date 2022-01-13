require("dotenv").config()

const mongoose = require("mongoose")
const Edusign = require("../models/Edusign")
const axios = require("axios")
const { Promise } = require("bluebird")
const moment = require("moment")
const uniq = require("lodash/uniq")

mongoose.connect("mongodb+srv://admin:admin@cluster0.zjt5k.mongodb.net/test")
const db = mongoose.connection

db.on("error", (err) => console.log(err))
db.once("open", () => console.log("connected to db"))

const { REACT_APP_EDUSIGN_TOKEN } = process.env
console.log(REACT_APP_EDUSIGN_TOKEN)

const getCourses = async () => {
  const start = moment('2021-09-13T00:00:00.000').toISOString()
  const end = moment().add(1, "days").toISOString()

  let courses = []
  let page = 0
  let hasMorePages = true

  while (hasMorePages) {
    console.log("requestiong")
    const response = await axios.get(
      `https://ext.edusign.fr/v1/course?page=${page}&filters=locked&start=${start}&end=${end}`,
      {
        headers: {
          "Authorization": `Bearer ${REACT_APP_EDUSIGN_TOKEN}`,
          "Content-Type": "application/json"
        }
      })

  
      courses = [...courses, ...response.data.result.filter(r => r.NAME === "DevWeb EE2")]
      page += 1
      hasMorePages = response.data.result.length === 40
  }

  return (
    courses.filter(course => (
      course.STUDENTS.filter(s => s.delay).length > 0
    ))
    .map(course => (
      {
        start: course.START,
        end: course.END,
        students: course.STUDENTS.filter(s => s.delay)
      }
    ))
  )
}

const getStudents = async ids => {
  const students = []

  await Promise.mapSeries(ids, async id => {
    const response = await axios.get(
      `https://ext.edusign.fr/v1/student/${id}`,
      {
        headers: {
          "Authorization": `Bearer ${REACT_APP_EDUSIGN_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )

    students.push(response.data)
  })

  return students.map(s => s.result)
}


const job = async () => {
  console.log("doing job")
  let courses = []
  let ranks = []
  let students = []

  try {
    courses = await getCourses()
    
    if (courses.length > 0) {
      let uniqueIds = courses.map(course => (
        course.students.map(s => s.studentId)
      )) || []
    
      uniqueIds = uniq(uniqueIds.flat())
    
      students = await getStudents(uniqueIds)
    }

    if (students.length > 0) { 
      courses.forEach(course => {
        course.students.forEach(s => {
          const existingRank = ranks.find(rank => rank.id === s.studentId)

          if (existingRank) {
            const newRank = {
              ...existingRank,
              delay: existingRank.delay + s.delay
            }

            const rankIndex = ranks.findIndex(r => r.id === existingRank.id)
            ranks[rankIndex] = newRank
          } else {
            ranks.push({
              id: s.studentId,
              delay: s.delay
            })
          }
        })
      })

      ranks = ranks.sort((a, b) => b.delay - a.delay).map((rank, i) => ({
        rank: i + 1,
        firstName: students.find(s => s.ID === rank.id).FIRSTNAME,
        lastName: students.find(s => s.ID === rank.id).LASTNAME,
        delay: rank.delay
      }))
    }

    console.log("ranks", ranks)
  } catch (error) {
    console.log(error)
  }

  try {
    const data = await Edusign.findOneAndUpdate(
      { _id: "61e0105374efbca54f45527c" },
      {
        ranks: ranks,
        courses: courses,
        students: students
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