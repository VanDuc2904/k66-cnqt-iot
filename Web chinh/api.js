const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Đường dẫn đến file lưu trữ dữ liệu JSON
const dataFilePath = path.join(__dirname, 'web-chinh-data.json');

// Hàm đọc dữ liệu từ file JSON
function readData() {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    // Trả về dữ liệu mặc định nếu không tìm thấy file
    return {
        notification: "Welcome!",
        map: {
            latitude: 0,
            longitude: 0,
            title: "Default Location"
        }
    };
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// API để lấy dữ liệu hiện tại
app.get('/api/data', (req, res) => {
    try {
        const data = readData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// API để cập nhật thông báo
app.post('/api/notification', (req, res) => {
    try {
        const { notification } = req.body;
        const data = readData();
        data.notification = notification;
        writeData(data);
        res.json({ success: true, message: 'Notification updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// API để cập nhật vị trí bản đồ
app.post('/api/map', (req, res) => {
    try {
        const { latitude, longitude, title } = req.body;
        const data = readData();
        data.map = { latitude, longitude, title };
        writeData(data);
        res.json({ success: true, message: 'Map settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update map settings' });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
