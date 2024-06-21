const banks = require('./banks');
const {readFileSync, writeFile} = require('fs');
const { bankScraper } = require('./scraper');
const puppeteer = require('puppeteer');

const FILENAME = "banks.json"


const main = async () => {
    const browser = await puppeteer.launch().catch((err) => console.log(err));

    const bankFile = readFileSync(FILENAME);
    bankList = JSON.parse(bankFile);
    var out = [];
    for (const bank of bankList) {
        //try{    
            out = out.concat(await bankScraper(bank.url, bank.Bank, browser));
        //}
        //catch {
            //console.log(bank.Bank + "failed");
        //}

    }
    out = out.flat();
    writeFile('rates.json', JSON.stringify(out), (err)=> {if(err) { throw err}});
    console.log("run");
};

main();