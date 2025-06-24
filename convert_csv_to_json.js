const fs = require('fs');
const path = require('path');

const csvFilePath = path.join(__dirname, 'questions_new.csv');
const jsonFilePath = path.join(__dirname, 'questions.json');

fs.readFile(csvFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading CSV file:', err);
        return;
    }

    const lines = data.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            let value = values[j];
            // Convert points to number
            if (headers[j] === 'points') {
                value = parseInt(value, 10);
            }
            obj[headers[j]] = value;
        }
        result.push(obj);
    }

    fs.writeFile(jsonFilePath, JSON.stringify(result), 'utf8', (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return;
        }
        console.log('Successfully converted questions_new.csv to questions.json');
    });
});

// Function to parse a CSV line, handling commas within double quotes
function parseCsvLine(line) {
    const result = [];
    let inQuote = false;
    let currentField = '';
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuote = !inQuote;
        } else if (char === ',' && !inQuote) {
            result.push(currentField.trim());
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField.trim()); // Add the last field
    return result.map(field => field.replace(/^"|"$/g, '')); // Remove surrounding quotes
}
