const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const notificationRef = db.collection('settings').doc('notification');
const mapSettingsRef = db.collection('settings').doc('mapSettings');

app.post('/api/notification', async (req, res) => {
    const { notification } = req.body;
    try {
        await notificationRef.set({ content: notification });
        res.status(200).send({ message: 'Thông báo đã được cập nhật.' });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).send({ error: 'Không thể cập nhật thông báo.' });
    }
});

app.get('/api/notification', async (req, res) => {
    try {
        const doc = await notificationRef.get();
        if (doc.exists) {
            res.status(200).send({ notification: doc.data().content });
        } else {
            res.status(404).send({ error: 'Không tìm thấy thông báo.' });
        }
    } catch (error) {
        console.error('Error getting notification:', error);
        res.status(500).send({ error: 'Không thể lấy thông báo.' });
    }
});

app.post('/api/map', async (req, res) => {
    const { latitude, longitude, title } = req.body;
    try {
        await mapSettingsRef.set({ latitude: parseFloat(latitude), longitude: parseFloat(longitude), title });
        res.status(200).send({ message: 'Cài đặt bản đồ đã được cập nhật.' });
    } catch (error) {
        console.error('Error updating map settings:', error);
        res.status(500).send({ error: 'Không thể cập nhật cài đặt bản đồ.' });
    }
});

app.get('/api/map', async (req, res) => {
    try {
        const doc = await mapSettingsRef.get();
        if (doc.exists) {
            res.status(200).send(doc.data());
        } else {
            res.status(404).send({ error: 'Không tìm thấy cài đặt bản đồ.' });
        }
    } catch (error) {
        console.error('Error getting map settings:', error);
        res.status(500).send({ error: 'Không thể lấy cài đặt bản đồ.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
