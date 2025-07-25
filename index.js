const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/reset-password', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const newPassword = Math.random().toString(36).slice(-8); // Random 8-char password

    const cmd = `powershell.exe "Set-ADAccountPassword -Identity '${username}' -NewPassword (ConvertTo-SecureString '${newPassword}' -AsPlainText -Force)"`;

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${stderr}`);
            return res.status(500).json({ error: 'Password reset failed' });
        }

        console.log(`✅ Password reset for ${username}: ${newPassword}`);
        res.json({ message: 'Password reset successfully', newPassword });
    });
});

app.listen(port, () => {
    console.log(`🔐 Password Reset API running at http://localhost:${port}`);
});
