const fs = require('fs')

const job = () => {
  const number = Math.floor(Math.random() * 1000) + 1
  const array = [number]
  fs.readFile('./data.json', (err, data) => {
    console.log(err)
    console.log(JSON.parse(data))

    fs.writeFile('./data.json', JSON.stringify(array), (err) => {
      console.log(err)
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