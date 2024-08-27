const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Khởi tạo Firebase
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyC3EhCzgXR02e_gjvJqEb32htKMqo3mXug",
  authDomain: "tld66-3d929.firebaseapp.com",
  projectId: "tld66-3d929",
  storageBucket: "tld66-3d929.appspot.com",
  messagingSenderId: "580068871289",
  appId: "1:580068871289:web:d46a8e49eee792a6d518a8",
  measurementId: "G-3R2JXXFMD0"
};

// Initialize Firebase App
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const notificationRef = db.collection('settings').doc('notification');
const mapSettingsRef = db.collection('settings').doc('mapSettings');

app.use(cors());
app.use(bodyParser.json());

// API để cập nhật thông báo
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

// API để lấy thông báo hiện tại
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

// API để cập nhật cài đặt bản đồ
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

// API để lấy cài đặt bản đồ hiện tại
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
