require('dotenv').config();
const Person=require('./models/person');
const express = require('express');
const morgan = require('morgan');
const cors= require('cors');
const app = express();

// let persons=[
//   {
//     'id': 1,
//     'name': 'Arto Hellas',
//     'number': '040-123456',
//   },
//   {
//     'id': 2,
//     'name': 'Ada Lovelace',
//     'number': '39-44-5323523',
//   },
//   {
//     'id': 3,
//     'name': 'Dan Abramov',
//     'number': '12-43-234345',
//   },
//   {
//     'id': 4,
//     'name': 'Mary Poppendieck',
//     'number': '39-23-6423122',
//   },
// ];

morgan.token('body', (req, res) => {
  if (req.method==='POST') {
    return JSON.stringify(req.body);
  } else {
    return null;
  }
});
app.use(express.static('build'));
app.use(cors());
app.use(express.json());
app.use(morgan(function(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
  ].join(' ');
}));
const errorHandler=(err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: `${err.message}` });
  }

  next(err);
};

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
//   return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER- 0 + 1) + 0);
// };

// const checkName = (name) => {
//   let ckeck=false;
//   persons.forEach((person) => ckeck = ckeck || person.name===name);
//   return !ckeck;
// };

app.get('/api/info', (request, response, next) => {
  // let total=0;
  // const totalPersons=persons.reduce(() => total=total+1, 0);
  Person.count()
      .then((total) => {
        console.log(total);
        response.send(
            `<h3>Phonebook has info for ${total} peoples</h3>
            <h3>${new Date()}</h3>`);
      })
      .catch((error) => {
        next(error);
      } );
});

app.get('/api/persons', (request, response, next) => {
  Person.find({})
      .then((persons) => {
        response.json(persons);
      })
      .catch((error) => {
        next(error);
      } );
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
      .then((person) => {
        response.json(person);
      })
      .catch((error) => {
        next(error);
      } );
});

app.delete('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // persons = persons.filter((person) => person.id !== id);

  // response.status(204).end();
  Person.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(204).end();
      })
      .catch((error) => {
        next(error);
      } );
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!(body.name && body.number )) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  // if (!checkName(body.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique',
  //   });
  // }

  const person = new Person({
    // id: generateId(),
    name: body.name,
    number: body.number,
  });
  // persons = persons.concat(person);
  // response.json(person);

  person.save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((err) => next(err));
});

app.put('/api/persons/:id', (request, response, next) => {
  const number = request.body.number;

  Person.findByIdAndUpdate(request.params.id, { number: number },
      { new: true, runValidators: true, context: 'query' })
      .then( (updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((err) => next(err));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);

module.exports=app;
