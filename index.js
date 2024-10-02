const express = require("express");
const app = express();

app.use(express.json());

const students = [
    { id: 1, name: "Jorge", age: 20, enroll: true },
    { id: 2, name: "Julian", age: 30, enroll: false },
    { id: 3, name: "Andres", age: 40, enroll: false }
];

// Ruta principal
app.get('/', (req, res) => {
    res.send("Node JS API");
});

// Obtener todos los estudiantes
app.get("/api/students", (req, res) => {
    res.send(students);
});

// Obtener un estudiante por ID
app.get("/api/students/:id", (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Estudiante no encontrado');
    res.send(student);
});

// Crear un nuevo estudiante
app.post("/api/students", (req, res) => {
    const student = {
        id: students.length + 1,
        name: req.body.name,
        age: parseInt(req.body.age),
        enroll: (req.body.enroll === 'true')
    };
    students.push(student); // Se usa 'student' en lugar de 'students'
    res.send(student);
});

// Eliminar un estudiante por ID
app.delete("/api/students/:id", (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) return res.status(404).send('Estudiante no encontrado');

    const index = students.indexOf(student); // Corrige 'index0f' a 'indexOf'
    students.splice(index, 1);
    res.send(student); // Enviar el estudiante eliminado en la respuesta
});

// Configuración del puerto
const port = process.env.PORT || 80;
app.listen(port, () => console.log(`Escuchando en puerto ${port}...`));
