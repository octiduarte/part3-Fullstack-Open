const express = require("express");
const morgan = require('morgan');
const app = express();

app.use(express.json());

morgan.token('body',(req)=> JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];



const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0 
    return maxId + 1
  }


app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person =>  person.id === id)
  
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  
app.post('/api/persons', (request, response) => {
    const {name,number} = request.body

  if(!name || !number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const nameExists = persons.some(person => person.name === name)
  if(nameExists) {
    return response.status(400).json({
        error: 'name must be unique'
      })
  }

  const person = {
    name: name,
    number: number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.status(201).json(person)

})


app.get("/info", (request,response) =>  {
    const personsLength = persons.length
    const currentDate = new Date()

    response.send(
        `<p>Phonebook has info for ${personsLength} people</p>
        <p>${currentDate}</p>`
    )
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const PORT = 3002;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
