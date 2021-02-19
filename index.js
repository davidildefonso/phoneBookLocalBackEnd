const { response } = require("express");
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

morgan.token('reqBody', (req, res) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody',
 { skip:(req,res)=> req.method!=="POST"}
)) ;

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]
    


app.get("/",(request,response)=>{  
  response.send("<h1>hello world</h1>");
});

app.get("/info",(request,response)=>{  
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
});

app.get("/api/persons",(request,response)=>{
  response.json(persons);
});

app.get("/api/persons/:id",(request,response)=>{
  const id=Number(request.params.id);

  const person= persons.find(person=>
    person.id===id);
  
  if(person){
    response.json(person);
  }else{
    response.status(404).end();
  }
  
});

app.delete("/api/persons/:id",(request,response)=>{
  console.log("params ",request.params)
  console.log("body :",request.body)
  const id=Number(request.params.id);
  persons=persons.filter(person=>person.id!==id);
  
  response.status(204).end();
  
  
});


const generateID = () =>{
  const maxID= persons.length>0
  ? Math.max(...persons.map(n=>n.id))
  :0;
  return maxID+1;
}

app.post("/api/persons",(request,response)=>{ 

  const body = request.body;

  if(!body.name || !body.number){
    return response.status(400).json({
      error: "name and number are required"
    });
  }

  if( persons.find(p=>p.name===body.name)  ){
    return response.status(400).json({
      error: "name must be unique"
    });
  }


  const person = {
    name:body.name,
    number: body.number,   
    id: generateID()
  }

  console.log(person)

  persons=persons.concat(person);
  
  response.json(person);
});


app.put("/api/persons/:id",(request,response)=>{
  console.log("params ",request.params)
  console.log("body :",request.body)
  const id=Number(request.params.id);
  persons=persons.map(person=>person.id!==id
    ?person
    :{...request.body,id:id})
  response.json({...request.body,id:id});
  console.log("response ",{...request.body,id:id})
  console.log("persons ",persons)
});





const PORT = 3001;
app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});




