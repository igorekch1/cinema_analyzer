const csv = require('csvtojson')
const sw = require('stopword');
const _ = require('lodash');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const port = 3001;
const csvFilePath = "cinema1.csv";

app.use(cors());
app.use(bodyParser.json());

const stopWordsList = ["i", "a", "about", "an", "are", "as", "at", "be", "by", "com", "for", "from", "how", "in", "is", "it",
    "of", "on", "or", "that", "the", "this", "to", "was", "what", "when", "where", "who", "will", "with", "the", "www", "its"
];

const processData = (str) => {
    // cast to lower case
    const lowerCaseString = str.toLowerCase();
    // regexp for numbers
    const withNoDigits = lowerCaseString.replace(/[0-9]/g, '');
    // regexp for special characters
    const withNoSpecCharacters = withNoDigits.replace(/[^a-zA-Z ]/g, "").split(" ");
    // removing stopwords
    const withNoStopwords = sw.removeStopwords(withNoSpecCharacters, stopWordsList).join(" ");

    return withNoStopwords.toLowerCase();
}

const getJSONfromCSV = async (file) => {
    const res = await csv().fromFile(file);

    const newArr = _.chain(res)
        .groupBy("v1")
        .map((value, key) => ({
            category: key,
            phrasesList: value.map(obj => processData(obj.v2))
        }))
        .value();

    return newArr;
}


// ----------------- task 3 ----------------------
app.get('/frequent', async (req, res) => {
    const jsonCSV = await getJSONfromCSV(csvFilePath);

    res.json({
        data: {}
    });
});
// -----------------------------------------------

app.listen(port, () => console.log(`Server is runnin on port ${port}`));