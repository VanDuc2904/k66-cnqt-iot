const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Đường dẫn đến file lưu trữ dữ liệu (JSON file)
const dataFilePath = path.join(__dirname, 'web-chinh-data.json');

// Hàm đọc dữ liệu từ file
function readData() {
    if (fs.existsSync(dataFilePath)) {
        const rawData = fs.readFileSync(dataFilePath);
        return JSON.parse(rawData);
    }
    return {
        notification: "",
        map: {
            latitude: 0,
            longitude: 0,
            title: ""
        }
    };
}

// Hàm ghi dữ liệu vào file
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// API để lấy dữ liệu hiện tại
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// API để cập nhật thông báo
app.post('/api/notification', (req, res) => {
    const { notification } = req.body;
    const data = readData();
    data.notification = notification;
    writeData(data);
    res.json({ success: true, message: 'Thông báo đã được cập nhật' });
});

// API để cập nhật vị trí bản đồ
app.post('/api/map', (req, res) => {
    const { latitude, longitude, title } = req.body;
    const data = readData();
    data.map = { latitude, longitude, title };
    writeData(data);
    res.json({ success: true, message: 'Vị trí bản đồ đã được cập nhật' });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app;
