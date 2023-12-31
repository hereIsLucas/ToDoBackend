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
    title: 'Code refactoring',
    beschreibung: 'Überprüfung und Verbesserung des bestehenden Codes',
    erstelldatum: '2023-06-14',
    erfuellungsdatum: null
  },
  {
    id: 2,
    title: 'Bug fixing',
    beschreibung: 'Behebung von Fehlern im Programm',
    erstelldatum: '2023-06-15',
    erfuellungsdatum: '2023-06-22'
  },
  {
    id: 3,
    title: 'Feature implementation',
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
  try {
    response.status(200).json(tasks)
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Gets the list of tasks'
  */

  /* #swagger.responses[200] = {
      description: "List of Tasks",
      schema: { $ref: "#/task"}
    } */
})
app.post('/tasks', (request, response) => {
  try {
    const newTask = request.body
    const newTitle = request.body.title
    const id = request.body.id
    if (!newTitle) {
      return response.status(406).json({ error: 'cannot add task without a title' })
    }
    tasks.push(newTask)
    response.status(201).json({ task: newTask, id })
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Make a new Task'
  */

  /* #swagger.responses[200] = {
      description: "the new Task",
      schema: { $ref: "#/task"}
    } */
})
app.get('/tasks/:id', (request, response) => {
  try {
    const id = request.params.id
    const task = tasks.find((task) => task.id == id)
    if (!task) {
      return response.status(404).json({ error: 'Task not found' })
    }
    response.status(200).json(task)
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Get a specific Task'
  */

  /* #swagger.responses[200] = {
      description: "the specific task",
      schema: { $ref: "#/task"}
    } */
})
app.put('/tasks/:id', (request, response) => {
  try {
    const editTask = request.body
    const id = request.params.id
    const taskId = tasks.findIndex((task) => task.id == id)

    if (taskId == -1) {
      return response.status(404).json({ error: 'Task not found' })
    }
    tasks.splice(taskId, 1, editTask)
    response.json(editTask)
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Change the value of object'
  */

  /* #swagger.responses[200] = {
      description: "changing",
      schema: { $ref: "#/task"}
    } */
})
app.delete('/tasks/:id', (request, response) => {
  try {
    const id = request.params.id
    const taskId = tasks.findIndex((task) => task.id == (id))
    if (taskId == -1) {
      return response.status(404).json({ error: 'Inexistence of this Id: ' + id })
    }
    tasks.splice(taskId, 1)
    response.json({ message: 'deleted this Id ' + id })
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Deleting of a task'
  */

  /* #swagger.responses[200] = {
      description: "deleted Task",
      schema: { $ref: "#/task"}
    } */
})
// -----------------Authentification and Authorisation-----------------//
app.post('/login', (request, response) => {
  try {
    const { email, password } = request.body
    if (!(password == 'm295')) {
      return response.status(401)
    }
    request.session.authenticated = true
    request.session.email = email
    response.json({ message: request.session.email })
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Give your login data to the server'
  */

  /* #swagger.responses[200] = {
      description: "login",
      schema: { $ref: "#/task"}
    } */
})// implement token??
app.get('/verify', (request, response) => {
  if (!request.session.email) {
    return response.status(401).json({ error: 'Unauthenticated' })
  }
  return response.status(200).json({ message: 'Authenticated', email: request.session.email })
})
app.delete('/logout', (request, response) => {
  try {
    request.session.email = undefined
    response.sendStatus(204)
  } catch (error) {
    console.error('Error:', error)
    response.status(500).json({ error: 'Our servers are down' })
  }
  /*
    #swagger.tags = ["definitions"]
    #swagger.description = 'Loggout'
  */

  /* #swagger.responses[200] = {
      description: "loging out and stopping the session",
      schema: { $ref: "#/task"}
    } */
})
app.use((request, response) => {
  response.status(404).json({ error: 'Your endpoint doesnt exist' })
})
app.listen(port, () => {
  console.log('Listening on Port: ', port)
})
