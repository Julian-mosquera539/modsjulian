// Requiere instalación de los siguientes paquetes: express, mongoose, body-parser
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Conexión con MongoDB (para registrar las descargas)
mongoose.connect('mongodb://localhost:27017/julianModsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
app.use(bodyParser.json());

// Definir el esquema de descargas
const downloadSchema = new mongoose.Schema({
    modName: String,
    downloadCount: { type: Number, default: 0 }
});

const Download = mongoose.model('Download', downloadSchema);

// Endpoint para registrar una descarga
app.post('/download', async (req, res) => {
    const { modName } = req.body;
    let download = await Download.findOne({ modName });

    if (!download) {
        download = new Download({ modName, downloadCount: 1 });
    } else {
        download.downloadCount += 1;
    }

    await download.save();
    res.send({ message: 'Descarga registrada', download });
});

// Obtener el número de descargas de un mod
app.get('/downloads/:modName', async (req, res) => {
    const { modName } = req.params;
    const download = await Download.findOne({ modName });
    if (download) {
        res.send(download);
    } else {
        res.status(404).send({ message: 'Mod no encontrado' });
    }
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('API de descargas corriendo en el puerto 3000');
});

