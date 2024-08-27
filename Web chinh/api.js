const express = require('express');
const bodyParser = require('body-parser');
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3EhCzgXR02e_gjvJqEb32htKMqo3mXug",
  authDomain: "tld66-3d929.firebaseapp.com",
  projectId: "tld66-3d929",
  storageBucket: "tld66-3d929.appspot.com",
  messagingSenderId: "580068871289",
  appId: "1:580068871289:web:d46a8e49eee792a6d518a8",
  measurementId: "G-3R2JXXFMD0"
};

// Initialize Firebase
const app = express();
app.use(bodyParser.json());
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// API để lấy dữ liệu hiện tại
app.get('/api/data', async (req, res) => {
    try {
        const docRef = doc(db, "settings", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            res.json(docSnap.data());
        } else {
            res.status(404).json({ error: 'Dữ liệu không tìm thấy' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Không thể lấy dữ liệu' });
    }
});

// API để cập nhật thông báo
app.post('/api/notification', async (req, res) => {
    const { notification } = req.body;
    try {
        await setDoc(doc(db, "settings", "data"), { notification }, { merge: true });
        res.json({ success: true, message: 'Thông báo đã được cập nhật' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật thông báo' });
    }
});

// API để cập nhật vị trí bản đồ
app.post('/api/map', async (req, res) => {
    const { latitude, longitude, title } = req.body;
    try {
        await setDoc(doc(db, "settings", "data"), { map: { latitude, longitude, title } }, { merge: true });
        res.json({ success: true, message: 'Vị trí bản đồ đã được cập nhật' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật vị trí bản đồ' });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app;
