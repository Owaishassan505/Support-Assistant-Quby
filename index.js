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

    // Generate secure random 10-character password
    const newPassword = Math.random().toString(36).slice(-10) + '#1A';

    // Build PowerShell command to reset AD password
    const powershellCommand = `powershell.exe -Command "Set-ADAccountPassword -Identity '${username}' -Reset -NewPassword (ConvertTo-SecureString '${newPassword}' -AsPlainText -Force)"`;

    exec(powershellCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error resetting password for ${username}:`, error.message);
            console.error(`📄 stderr: ${stderr}`);
            return res.status(500).json({ error: 'Password reset failed', details: stderr });
        }

        console.log(`✅ Password for '${username}' reset successfully to: ${newPassword}`);
        res.json({
            message: 'Password reset successfully',
            username,
            newPassword
        });
    });
});

app.listen(port, () => {
    console.log(`🔐 Password Reset API running at http://localhost:${port}`);
});
