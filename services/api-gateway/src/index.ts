import express, { Request, Response } from 'express';
import mqtt from 'mqtt';
import axios from 'axios';

const app = express();
const port = 3000;

const mqttclient = mqtt.connect('mqtt://mqtt-service:1883');

mqttclient.on('connect', () => {
    console.log('Conectado al broker MQTT');
    mqttclient.subscribe('iot/devices', (err) => {
        if (!err) {
            console.log('Suscrito al tema "iot/devices"');
        } else {
            console.error(`Hubo un error al suscribirse: ${err}`);
        }
    });
});

mqttclient.on('message', (topic: string, message: Buffer) => {
    console.log(`Mensaje recibido en ${topic}: ${message.toString()}`);
    axios
        .post('http://backend:3000/api/handle-message', { message: message.toString() })
        .then((response) => console.log('Mensaje enviado al backend:', response.data))
        .catch((err) => console.error('Error al enviar el mensaje:', err));
});

app.get('/', (req: Request, res: Response) => {
    res.send('API Gateway corriendo');
});

app.listen(port, () => {
    console.log(`API Gateway corriendo en http://localhost:${port}`);
});
