const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Kết nối tới MongoDB
mongoose.connect('YOUR_MONGODB_ATLAS_URL', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Định nghĩa schema và model
const DataSchema = new mongoose.Schema({
    notification: String,
    map: {
        latitude: Number,
        longitude: Number,
        title: String
    }
});

const DataModel = mongoose.model('Data', DataSchema);

// API để lấy dữ liệu hiện tại
app.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.findOne({});
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

// API để cập nhật thông báo
app.post('/api/notification', async (req, res) => {
    const { notification } = req.body;
    try {
        let data = await DataModel.findOne({});
        if (!data) {
            data = new DataModel();
        }
        data.notification = notification;
        await data.save();
        res.json({ success: true, message: 'Thông báo đã được cập nhật' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// API để cập nhật vị trí bản đồ
app.post('/api/map', async (req, res) => {
    const { latitude, longitude, title } = req.body;
    try {
        let data = await DataModel.findOne({});
        if (!data) {
            data = new DataModel();
        }
        data.map = { latitude, longitude, title };
        await data.save();
        res.json({ success: true, message: 'Vị trí bản đồ đã được cập nhật' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update map settings' });
    }
});

// Khởi động server
app.listen(3000, () => {
    console.log('Server đang chạy trên cổng 3000');
});

module.exports = app;
