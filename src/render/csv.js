const fs = require('fs');
const csv = require('@fast-csv/parse');

function readCSVData(file, callback) {
    const data = [];
    fs.createReadStream(file)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => data.push(row))
        .on('end', () => callback());
    return data;
}