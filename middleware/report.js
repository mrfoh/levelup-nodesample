const fs = require('fs');
const path = require('path');
const split = require('split2');
const filepath = path.join(__dirname, '../public/dataset.json');

module.exports = (req, res) => {
    try {
        const readStream = fs.createReadStream(filepath).pipe(split(JSON.parse));
    } catch (error) {
        res.status(400)
        res.json({
            message: error.message
        });
    }
}