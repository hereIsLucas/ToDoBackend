const express = require('express')
const session = require('express-session')
const app = express()
// define a port on which it should listen too
const port = 3000
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json')

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// generated by ChatGPT
const tasks = [
  {
    id: 1,
    titel: 'Code refactoring',
    beschreibung: 'Überprüfung und Verbesserung des bestehenden Codes',
    erstelldatum: '2023-06-14',
    erfuellungsdatum: null
  },
  {
    id: 2,
    titel: 'Bug fixing',
    beschreibung: 'Behebung von Fehlern im Programm',
    erstelldatum: '2023-06-15',
    erfuellungsdatum: '2023-06-22'
  },
  {
    id: 3,
    titel: 'Feature implementation',
    beschreibung: 'Entwicklung und Implementierung neuer Funktionen',
    erstelldatum: '2023-06-16',
    erfuellungsdatum: null
  }
]
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Copied from classwork @Bosshard
app.use(session({
  secret: 'seupersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}))
app.all('/tasks/*', (request, response, next) => {
  if (!request.session.email) {
    response.status(403).json({ message: 'Unauthenticaded' })
  }
  next()
})
// -----------------Tasks and their CRUD endpoints-----------------//
app.get('/tasks', (request, response) => {
  response.status(200).json(tasks)
})
app.post('/tasks', (request, response) => {
  const newTask = request.body
  const id = request.body.id
  tasks.push(newTask)
  response.status(201).json({ task: newTask, id })
})
app.get('/tasks/:id', (request, response) => {
  const id = request.params.id
  const task = tasks.find((task) => task.id === id)
  if (!task) {
    return response.status(404).json({ error: 'Task not found' })
  }
  response.status(200).json(task)
})
app.put('/tasks/:id', (request, response) => {
  const editTask = request.body
  const id = request.params.id
  const taskId = tasks.findIndex((task) => String(task.id) === String(id))

  if (taskId === -1) {
    return response.status(404).json({ error: 'Task not found' })
  }
  tasks.splice(taskId, 1, editTask)
  response.json(editTask)
})
app.delete('/tasks/:id', (request, response) => {
  const id = request.params.id
  const taskId = tasks.find((task) => task.id === (id))
  if (taskId === -1) {
    return response.status(404).json({ error: 'Inexistence of this Id: ' + id })
  }
  tasks.splice(taskId, 1)
  response.json({ message: 'deleted this Id ' + id })
})
// -----------------Authentification and Authorisation-----------------//
app.post('/login', (request, response) => {
  const { email, password } = request.body
  if (!(password === 'm295')) {
    return response.status(401)
  }
  request.session.authenticated = true
  request.session.email = email
  response.json({ message: request.session.email })
})// implement token??
app.get('/verify', (request, response) => {
  if (!request.session.email) {
    return response.status(401).json({ error: 'Unauthenticated' })
  }
  return response.status(200).json({ message: 'Authenticated', email: request.session.email })
})
app.delete('/logout', (request, response) => {
  request.session.email = undefined
  response.sendStatus(204)
})
app.listen(port, () => {
  console.log('Listening on Port: ', port)
})
