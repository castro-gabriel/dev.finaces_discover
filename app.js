const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
var db = mongoose.connection


app.post('/signin', async (req, res) => {
  var email = req.body.email
  var password = req.body.password

  // var user = await db.collection("users")

  // if (user.email != email || user.password != password) {
  //   // return res.status(400).send({error: 'Invalid email or password'})
  //   return res.send(console.log( email))
  // }

  return res.redirect('./App/index.html')
})

app.get('/', (req, res) => {
  res.set({"Allow-access-Allow-Origin": "*"})
  return res.redirect('index.html')
})

app.listen(3000, () => "Server is running in port 3000.")