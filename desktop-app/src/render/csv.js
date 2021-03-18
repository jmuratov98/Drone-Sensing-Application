const fs = require('fs');
const csv = require('@fast-csv/parse');

function convertCoord(coord) {
    const indexOfNegative = coord.indexOf('-');
    const [negSign, num] = indexOfNegative ? [coord.substr(0, indexOfNegative), coord.substr(indexOfNegative + 1)] : ['', coord];
    const i = num.length == 9 ? 2 : 3;
    const [leftOfDecimal, rightOfDecimal] = [num.substr(0, i), num.substr(i)];
    return [negSign, leftOfDecimal, '.', rightOfDecimal].join('');
}

function convertData(data, row) {
    for(prop in row) {
        // trimming whitespace on the edges ' something ' => 'something'
        row[prop] = row[prop].trim();

        // converting mm to m
        if(prop === 'Height') row[prop] /= 1000;

        // Adding decimal points to longitude and latitude
        if(prop == 'Latitude') row[prop] = convertCoord(row[prop])
        if(prop == 'Longitude') row[prop] = convertCoord(row[prop])
    }
    data.push(row);
}

function readCSVData(file, callback) {
    const data = [];
    fs.createReadStream(file)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => convertData(data, row))
        .on('end', () => callback());
    return data;
}