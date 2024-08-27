const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Biến lưu trữ dữ liệu trong bộ nhớ
let dataStore = {
    notification: "Welcome!",
    map: {
        latitude: 20.99567,
        longitude: 105.80676,
        title: "Trường ĐH Khoa học Tự nhiên, ĐHQG HN"
    }
};

// API để lấy dữ liệu hiện tại
app.get('/api/data', (req, res) => {
    res.json(dataStore);
});

// API để cập nhật thông báo
app.post('/api/notification', (req, res) => {
    const { notification } = req.body;
    if (notification) {
        dataStore.notification = notification;
        res.json({ success: true, message: 'Notification updated successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Notification content is required' });
    }
});

// API để cập nhật vị trí bản đồ
app.post('/api/map', (req, res) => {
    const { latitude, longitude, title } = req.body;
    if (latitude && longitude && title) {
        dataStore.map = { latitude, longitude, title };
        res.json({ success: true, message: 'Map settings updated successfully' });
    } else {
        res.status(400).json({ success: false, message: 'Latitude, Longitude, and Title are required' });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
