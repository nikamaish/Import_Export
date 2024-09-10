const puppeteer = require('puppeteer');
// library for web scraping

async function scrapeGSTIN(gstin) {
  const browser = await puppeteer.launch({ headless: false });
  // Launches a new browser instance using Puppeteer. The headless: true option means that the browser runs in the background without a graphical user interface.
  const page = await browser.newPage();
  // Opens a new page (tab) in the browser. This page will be used to navigate to the target website and perform the scraping.
  
  try {
    await page.goto(`https://razorpay.com/gst-number-search/${gstin}`, { waitUntil: 'networkidle0' });
    //  The { waitUntil: 'networkidle0' } option tells Puppeteer to wait until there are no more than 0 network connections for at least 500 ms, indicating that the page has fully loaded.
    console.log('Page loaded, extracting data...');

    await page.waitForSelector('h1', { timeout: 20000 });
    // Waits up to 10 seconds for the <h1> element to appear on the page. This ensures that the required element is present before attempting to scrape data.
    
    const data = await page.evaluate(() => {
      // Runs the provided function inside the context of the page. This function can access and manipulate the DOM of the page.
      const extractText = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
        // Defines a helper function extractText that takes a CSS selector as an argument. It finds the first element that matches the selector and returns its trimmed text content. If no element is found, it returns an empty string.
      };

      const extractDivData = (key) => {
        const divs = document.querySelectorAll('div[data-custom-component="box"], div[data-blade-component="box"]');
        for (let div of divs) {
          const label = div.querySelector('p');
          const value = div.querySelector('h5, span'); // Selects both h5 and span
          if (label && value) {
            console.log(`Label: ${label.textContent.trim()}, Value: ${value.textContent.trim()}`); // Debug logging
            if (label.textContent.trim().toLowerCase().includes(key.toLowerCase())) {
              return value.textContent.trim();
            }
          }
        }
        return '';
      };
      
      // Defines another helper function extractDivData that takes a key as an argument. It finds all div elements with specific attributes (data-custom-component="box" or data-blade-component="box"). For each div, it looks for child <p> (label) and <h5> or <span> (value) elements. It logs the label and value for debugging purposes and returns the value if the label includes the specified key. If no matching key is found, it returns an empty string.

      return {
        gstin: extractText('h1').split('is ').pop().trim(),
        legalNameOfBusiness: extractText('h1').split('of ')[1].split(' is')[0].trim(),
        gstinStatus: extractDivData('gstin status'),
        constitutionOfBusiness: extractDivData('constitution of business'),
        taxpayerType: extractDivData('taxpayer type'),
        dateOfRegistration: extractDivData('date of registration'),
        stateJurisdiction: extractDivData('state jurisdiction')
        
      };
    });
    // gstin: Extracted from the <h1> element by splitting and trimming the text.
// legalNameOfBusiness: Extracted from the <h1> element by splitting and trimming the text.
// Other fields are extracted using the extractDivData function with the appropriate key.

    console.log('Scraped data:', JSON.stringify(data, null, 2));
    return data;

  } catch (error) {
    console.error('Error scraping GSTIN:', error);
    return null;
  } finally {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await browser.close();
  }
  // In the finally block, it waits for 5 seconds (using a promise) before closing the browser to ensure that any remaining tasks are completed.
}

scrapeGSTIN('10AADCO6672Q1Z1').then(details => {
  console.log('Final result:', JSON.stringify(details, null, 2));
  //  the null means all properties are included in the JSON string, and the 2 means the output is formatted with 2 spaces for indentation.
});
