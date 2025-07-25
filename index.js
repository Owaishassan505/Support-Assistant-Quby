const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/reset-password', (req, res) => {
    const { username, domain } = req.body;

    if (!username || !domain) {
        return res.status(400).json({ error: 'Missing username or domain' });
    }

    const newPassword = Math.random().toString(36).slice(-8);
    const cmd = `python3 reset_password.py ${username} ${domain} ${newPassword}`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ ${stderr}`);
            return res.status(500).json({ error: 'Password reset failed' });
        }

        console.log(`✅ Reset for ${username}: ${newPassword}`);
        res.json({ message: 'Password reset successful', newPassword });
    });
});

app.listen(port, () => {
    console.log(`🔐 API running at http://localhost:${port}`);
});
