const puppeteer = require('puppeteer');

const re = new RegExp("([0-9]+) ([a-zA-Z])")

// much of this base code is from https://www.youtube.com/watch?v=ssRo5nVOvrQ&list=WL&index=2&t=259s, a helpful tutorial
const bankScraper = async (url, bank, browser) => {
    const re = "(?<len>[0-9\.]+)( |-)(?<unit>MONTH|YEAR|DAY)";
    const page = await browser.newPage();
    await page.goto(url);
    
    //process the following code w.r.t. the page:
    const allRates = await page.evaluate( async (url, bank, re) => {

        const tables = Array.from(document.querySelectorAll('table'));
        var output = [];
        //iterate over the tables (CD-ception)
        for(let j = 0; j < tables.length; j++) {
            //setup for finding the column meanings
            var colInd = 0;
            const rows = tables[j].querySelectorAll('tr');
            const head = rows[0].querySelectorAll('th');
            var termNum = apyNum = minNum = -1;
            graduated_rates = [];
            //iterate over the table head to find the column meanings the we care about (term, apy, min)
            head.forEach((col) => {
                if(col.innerText.match(/term|type/i)) {//if the column is concerning Term
                        termNum = colInd;
                }
                if(col.innerText.match(/apy|Annual Percentage Yield/i)) {
                    apyNum = colInd;
                }
                if(col.innerText.match(/min/i)) {
                    minNum = colInd;
                }
                colInd++;//keep track of which index we are at
            });

            //detect if this is a valid table, skip if it's not
            if(termNum == -1 || apyNum == -1) {
                continue;
            }

            var a = Array.from(rows);
            //iterate over the rows in the table
            for(let i = 1; i < a.length; i++) {

                try{//if the matches are null, extract an error (from .groups on the null value) and move to next row
                    //NOTE: need for try/catch is outdated, see if statement
                    const rowElements = Array.from(rows[i].querySelectorAll('td, th'));
                    const m = rowElements[termNum].innerText.toUpperCase().match(re)
                    
                    var len =  unit= rowElements[termNum].innerText;
                    const apy = rowElements[apyNum].innerText;
                    
                    if(m == null) {//check the regex
                        a[i] = -1;
                        continue;
                    }
                    len = m.groups.len;
                    unit = m.groups.unit;

                    var min;
                    if(minNum == -1) {
                        min = 0;
                    }
                    else {
                        min = rowElements[minNum].innerText;
                    }
                    a[i] = {url, bank, unit, len, apy, min};//setup the return value. This represents a single rate
                }
                catch {
                    a[i] = -1;
                }

            }
            //add in the rates from this table to the overall rate array collection
            output = output.concat(a.slice(1));
        }
        return output;
    }, url, bank, re);

    await page.close();

    return allRates;
};
module.exports = {bankScraper};
