require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get('/', async (req, res) => {
    const customObjectsUrl = 'https://api.hubapi.com/crm/v3/objects/cars?properties=name,brand,color';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(customObjectsUrl, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Homepage | Custom Objects', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates');
});

app.post('/update-cobj', async (req, res) => {
    const { name, brand, color } = req.body;
    const updateData = {
        properties: {
            name,
            brand,
            color
        }
    };

    const customObjectsUrl = 'https://api.hubapi.com/crm/v3/objects/cars';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(customObjectsUrl, updateData, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating data');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
