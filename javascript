const express = require('express');
const crypto = require('crypto');
const app = express();
app.use(express.json());

const BOT_TOKEN = 'YOUR_BOT_TOKEN_FROM_BOTFATHER';

// Fungsi untuk validasi data dari Telegram
function verifyTelegramData(initData) {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    urlParams.sort();

    let dataCheckString = '';
    urlParams.forEach((val, key) => {
        dataCheckString += `${key}=${val}\n`;
    });
    dataCheckString = dataCheckString.slice(0, -1);

    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
    const scHmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return scHmac === hash;
}

app.post('/api/save-points', (req, res) => {
    const { initData, points } = req.body;

    if (verifyTelegramData(initData)) {
        // Simpan poin ke Database (MongoDB/PostgreSQL)
        console.log("Data Valid! Menyimpan poin...");
        res.status(200).send({ status: 'success' });
    } else {
        res.status(403).send({ status: 'error', message: 'Data tidak valid' });
    }
});

app.listen(3000, () => console.log('Server berjalan di port 3000'));
