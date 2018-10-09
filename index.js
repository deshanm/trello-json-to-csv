// const trelloJson  = require('./YUe4pSHn.json');
const fastCSV = require('fast-csv');
const _ = require('lodash');
const fs = require('fs')

const INPUT_FOLDER_PATH = './input-folder/';
const OUTPUT_FOLDER_PATH = './output-folder/';


function writeToFile(file, newList) {
    console.log('start to writeToFile', file)

    var csvStream = fastCSV.createWriteStream({ headers: true }),
        writableStream = fs.createWriteStream(`./${OUTPUT_FOLDER_PATH}/${file}.csv`);

    writableStream.on("finish", function () {
        console.log("DONE!");
    });
    csvStream.pipe(writableStream);
    newList.forEach((item) => {
        csvStream.write(item);
    })
    csvStream.end();
}

function convertToCSVFile(file) {
    console.log('start to convertToCSVFile', file)
    const trelloJson = require(`./${INPUT_FOLDER_PATH}/${file}`);
    var lists = trelloJson.lists;
    var members = trelloJson.members;
    const newList = [];
    trelloJson.cards.forEach(card => {
        const listName = _.find(lists, { id: card.idList }).name;
        let member = null;
        if (card.idMembers[0]) {
            member = _.find(members, { id: card.idMembers[0] }).fullName;
        }
        cardName = card.name;
        newList.push({
            listName: listName,
            title: card.name,
            shortUrl: card.shortUrl,
            url: card.url,
            member: member,
        });

    });
    writeToFile(file, newList)
}
function getFilesList() {
    console.log('-------getFilesList()');
    const fs = require('fs');
    return fs.readdirSync(INPUT_FOLDER_PATH);
}
(function main() {
    console.log('-------app starting ----------');
    const files = getFilesList();
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        convertToCSVFile(file);
    }
    console.log('-------app finishing ----------');
})();