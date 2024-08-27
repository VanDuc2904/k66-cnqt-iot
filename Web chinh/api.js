// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin with service account credentials
const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.GOOGLE_PROJECT_ID,
  "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
  "private_key": process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Fix newline characters
  "client_email": process.env.GOOGLE_CLIENT_EMAIL,
  "client_id": process.env.GOOGLE_CLIENT_ID,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const notificationRef = db.collection('settings').doc('notification');
const mapSettingsRef = db.collection('settings').doc('mapSettings');

app.use(cors());
app.use(bodyParser.json());

// API to update notification
app.post('/api/notification', async (req, res) => {
    const { notification } = req.body;
    if (notification) {
        try {
            await notificationRef.set({ content: notification });
            res.status(200).send({ message: 'Notification updated successfully.' });
        } catch (error) {
            console.error('Error updating notification:', error);
            res.status(500).send({ error: 'Failed to update notification.' });
        }
    } else {
        res.status(400).send({ error: 'Invalid notification data.' });
    }
});

// API to get the current notification
app.get('/api/notification', async (req, res) => {
    try {
        const doc = await notificationRef.get();
        if (doc.exists) {
            res.status(200).send({ notification: doc.data().content });
        } else {
            res.status(404).send({ error: 'Notification not found.' });
        }
    } catch (error) {
        console.error('Error getting notification:', error);
        res.status(500).send({ error: 'Failed to get notification.' });
    }
});

// API to update map settings
app.post('/api/map', async (req, res) => {
    const { latitude, longitude, title } = req.body;
    if (latitude && longitude && title) {
        try {
            await mapSettingsRef.set({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                title: title
            });
            res.status(200).send({ message: 'Map settings updated successfully.' });
        } catch (error) {
            console.error('Error updating map settings:', error);
            res.status(500).send({ error: 'Failed to update map settings.' });
        }
    } else {
        res.status(400).send({ error: 'Invalid map settings data.' });
    }
});

// API to get the current map settings
app.get('/api/map', async (req, res) => {
    try {
        const doc = await mapSettingsRef.get();
        if (doc.exists) {
            res.status(200).send(doc.data());
        } else {
            res.status(404).send({ error: 'Map settings not found.' });
        }
    } catch (error) {
        console.error('Error getting map settings:', error);
        res.status(500).send({ error: 'Failed to get map settings.' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
