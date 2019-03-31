const fs = require('fs');
const path = require('path');

const filereader = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../public/message.txt');
        const messageBuffer = fs.readFileSync(filePath);
        const message = messageBuffer.toString();

        res.setHeader('Content-Type', 'text/plain');
        res.send(message);
    } catch (error) {
        res.status(400);
        res.json({
            message: error.message
        });
    }
}

module.exports = filereader;