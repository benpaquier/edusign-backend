const fs = require('fs')

const job = () => {
  const number = Math.floor(Math.random() * 1000) + 1
  const array = [number]
  fs.readFile('./data.json', (err, data) => {
    console.log("first err", err)
    console.log("first read")
    console.log(JSON.parse(data))

    fs.writeFile('./data.json', JSON.stringify(array), (err) => {
      console.log("write error", err)

      fs.readFile('./data.json', (err, data) => {
        console.log("second read error", err)
        console.log("second read")
        console.log(JSON.parse(data))
      })
    })
  })

  // fs.writeFile('./data.json', JSON.stringify(2), (err) => {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }

  //   // console.log(array)
  // })
}

job()