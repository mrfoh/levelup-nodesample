const fs = require('fs');
const path = require('path');
const split = require('split2');
const today = new Date();
const reportFileName = `./public/reports/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}/report.json`;
const filePath = path.join(__dirname, './public/dataset.json');
const destinationPath = path.join(__dirname, reportFileName);
const folderPath = path.join(__dirname, './public/reports');
const yearFolderPath = path.join(__dirname, `./public/reports/${today.getFullYear()}`);
const monthFolderPath = path.join(__dirname, `./public/reports/${today.getFullYear()}/${today.getMonth() + 1}`);
const dayFolderPath = path.join(__dirname, `./public/reports/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`);

const createStreams = () => {
    if (!fs.existsSync(folderPath)) {
        // create folders
       fs.mkdirSync(folderPath);
       fs.mkdirSync(yearFolderPath);
       fs.mkdirSync(monthFolderPath);
       fs.mkdirSync(dayFolderPath)
    } else {
        if (fs.existsSync(destinationPath)) {
            fs.unlinkSync(destinationPath);
        }
    }

    return {
        read: fs.createReadStream(filePath),
        write: fs.createWriteStream(destinationPath, { flags: 'w+'})
    }
}

let total = 0
let occurences = 0;

const exchangeRate = 360;
const streams = createStreams()
const readStream = streams.read;
const writeStream = streams.write;
const fileStats = fs.statSync(filePath);
const size = (fileStats.size / 1000000.0).toFixed(2);
const formatCurrency = (amount, currencyCode = '$', decimalCount = 2, decimal = '.', thousands = ',') => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';
    const stringValue = Math.abs(Number(amount) || 0).toFixed(decimalCount);
    let i = parseInt(stringValue).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + 
    currencyCode +
    (j ? i.substr(0, j) + thousands : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
    (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
}

console.log(`File size: ${size}mb`);
console.log(`Modified: ${fileStats.mtime}`)

//writeStream.on('error', (error) => console.error(error))
readStream
    .pipe(split(JSON.parse))
    .on('data', (record) => {
        const balance = record.balance.replace('$', '').replace(',', '');
        const value = parseFloat(balance);

        if (record.age > 35) {
            const report = JSON.stringify({
                contact_name: record.name,
                company: record.company,
                usd_value: formatCurrency(value),
                ngn_value: formatCurrency((value * exchangeRate), 'NGN'),
            });
            writeStream.write(`${report}\n`);
        }

        total += value;
        occurences++;
    })
    .on('end', () => {
        console.log({
            total: total.toFixed(2),
            average_balance: (total/occurences).toFixed(2),
            accountCount: occurences
        });
        writeStream.close();
    })
    .on('error', (error) => console.error(error));