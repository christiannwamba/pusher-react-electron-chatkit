const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:849469f4-0e30-445f-b357-797a7c2ca914',
  key: '2c6316d1-d271-437d-9d4e-561edb17bce2:L88FoR7H8gYHG+UKYOFg2FUBJ/QgUCXqipJoNi1AGuo=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  const payload = {name: username, id: username}
  chatkit
    .createUser(payload)
    .then(() => res.status(201).json(payload))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.status(201).json(payload);
      } else {
        res.status(error.statusCode).json(error)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const { grant_type } = req.body
  res.json(chatkit.authenticate({ grant_type, userId: req.query.user_id }))
})

const PORT = 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})