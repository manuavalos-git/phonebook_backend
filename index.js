const express = require('express')
const morgan = require('morgan')
const cors= require('cors')
const app = express()

let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// morgan.token('body', (req, res) =>{
//   if(req.method==='POST'){
//     return JSON.stringify(req.body)
//   }
//   else{
//     return null 
//   }
// })

app.use(cors())
app.use(express.json())
// app.use(morgan(function (tokens, req, res) {
//   return [
//     tokens.method(req, res),
//     tokens.url(req, res),
//     tokens.status(req, res),
//     tokens.res(req, res, 'content-length'), '-',
//     tokens['response-time'](req, res), 'ms',
//     tokens.body(req, res)
//   ].join(' ')
// }))

const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
    return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER- 0 + 1) + 0)
}

const checkName = (name) => {
    let ckeck=false
    persons.forEach(person=>ckeck = ckeck || person.name===name)
    return !ckeck
}

app.get('/api/', (request, response) => {
  let total=0
  const totalPersons=persons.reduce(()=>total=total+1,0)
  response.send(`<h3>Phonebook has info for ${totalPersons} peoples</h3><h3>${new Date()}</h3>`)
})

app.get('/api/info', (request, response) => {
    let total=0
    const totalPersons=persons.reduce(()=>total=total+1,0)
    response.send(`<h3>Phonebook has info for ${totalPersons} peoples</h3><h3>${new Date()}</h3>`)
  })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!(body.name && body.number )) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  if(!checkName(body.name)){
    return response.status(400).json({ 
        error: 'name must be unique' 
      })
  }

  const person = {
    id: generateId(),
    name:body.name,
    number:body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
module.exports=app