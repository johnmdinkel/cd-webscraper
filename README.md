This is my contribution from bitcamp2024. Check out my group's finished product here: https://devpost.com/software/cdaily

This Javascript program uses Node and Pupetteer.js to scrape CD rates from more than 10 predetermined banks on the web. 

This was my first code in Javascript! I used a youtube tutorial (I'll insert the link if I find it), but ended up changing most if not all of the code by the end of the project. 

The goal of this script was to make a single function call successfully scrape any bank's website. Banks format their tables in different ways, so I wrote my code to handle a few different cases. This should cover most
website formats. However, many websites require users to enter their zip code before the results are displayed, severly limiting the number of banks I could scrape from. Hence, we created a list of banks to scrape. 

Future Goals:
1. Create a barebones website (my group did it, but I'd like to get a feel for it myself)
2. run the script periodically (every day) and update the tables
3. allow users to input their zip code, scrape google search for many different banks, and then scrape those sites using the existing function (after responding to a website's prompt for zip code if applicable)
