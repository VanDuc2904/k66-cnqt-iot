const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

// Khởi tạo Firebase Admin bằng thông tin từ tệp .env
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

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
    if (notification) {
        try {
            await notificationRef.set({ content: notification });
            res.status(200).send({ message: 'Thông báo đã được cập nhật.' });
        } catch (error) {
            console.error('Error updating notification:', error);
            res.status(500).send({ error: 'Không thể cập nhật thông báo.' });
        }
    } else {
        res.status(400).send({ error: 'Thông báo không hợp lệ.' });
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
    if (latitude && longitude && title) {
        try {
            await mapSettingsRef.set({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                title: title
            });
            res.status(200).send({ message: 'Cài đặt bản đồ đã được cập nhật.' });
        } catch (error) {
            console.error('Error updating map settings:', error);
            res.status(500).send({ error: 'Không thể cập nhật cài đặt bản đồ.' });
        }
    } else {
        res.status(400).send({ error: 'Dữ liệu bản đồ không hợp lệ.' });
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

// Khởi động server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;
