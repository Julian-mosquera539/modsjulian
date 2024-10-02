const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Conexión con MongoDB
mongoose.connect('mongodb://localhost:27017/julianModsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.json());

const secretKey = 'supersecretkey';

// Esquema para Usuarios
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Esquema para Comentarios
const commentSchema = new mongoose.Schema({
    modName: String,
    username: String,
    comment: String,
    date: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', commentSchema);

// Registro de usuario
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    
    res.send({ message: 'Usuario registrado con éxito' });
});

// Inicio de sesión
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).send({ message: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).send({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ username: user.username }, secretKey);
    res.send({ message: 'Inicio de sesión exitoso', token });
});

// Crear comentario
app.post('/comment', async (req, res) => {
    const { token, modName, comment } = req.body;

    try {
        const decoded = jwt.verify(token, secretKey);
        const newComment = new Comment({
            modName,
            username: decoded.username,
            comment
        });
        await newComment.save();
        res.send({ message: 'Comentario añadido con éxito' });
    } catch (error) {
        res.status(401).send({ message: 'Token inválido' });
    }
});

// Obtener comentarios para un mod
app.get('/comments/:modName', async (req, res) => {
    const { modName } = req.params;
    const comments = await Comment.find({ modName });
    res.send(comments);
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('API de usuarios y comentarios corriendo en el puerto 3000');
});
