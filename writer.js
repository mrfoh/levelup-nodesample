const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, './public/names.txt');

const names = [
    "Temitayo",
    "Patrick",
    "Israel",
    "Kingsley",
    "Mayowa",
    "Sodiq",
    "Owanate",
    "Moronke",
    "Adeyinka",
    "Kehinde",
    "Kunle",
    "Orieno",
    "Sandra",
    "Simbiat"
];


try {
    // Write to file
    let content = names.join(",");
    content += "\n";
    fs.writeFileSync(filePath, content);
    const data = fs.readFileSync(filePath).toString();
    const people = data.split(",");
    let newContent = people.map(name => name.toUpperCase()).join(",");
    newContent += "\n";
    fs.appendFileSync(filePath, newContent);
} catch (err) {
    console.error(err);
}
