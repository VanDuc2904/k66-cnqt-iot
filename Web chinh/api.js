const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// Kết nối tới MongoDB
mongoose.connect('YOUR_MONGODB_ATLAS_URL', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Đã kết nối đến MongoDB'))
  .catch(err => console.error('Kết nối đến MongoDB thất bại:', err));

// Định nghĩa schema và model
const DataSchema = new mongoose.Schema({
    notification: { type: String, default: '' },
    map: {
        latitude: { type: Number, default: 0 },
        longitude: { type: Number, default: 0 },
        title: { type: String, default: '' }
    }
});

const DataModel = mongoose.model('Data', DataSchema);

// API để lấy dữ liệu hiện tại
app.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.findOne({});
        if (data) {
            res.json(data);
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
        let data = await DataModel.findOne({});
        if (!data) {
            data = new DataModel();
        }
        data.notification = notification;
        await data.save();
        res.json({ success: true, message: 'Thông báo đã được cập nhật' });
    } catch (err) {
        res.status(500).json({ error: 'Không thể cập nhật thông báo' });
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
        res.status(500).json({ error: 'Không thể cập nhật vị trí bản đồ' });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});

module.exports = app;
