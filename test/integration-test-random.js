const https = require('https');

function getRandom(min, max) {
  const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        const text = data.trim();
        const val = parseInt(text, 10);
        if (Number.isNaN(val)) return reject(new Error('Invalid number: ' + text));
        resolve(val);
      });
    }).on('error', reject);
  });
}

(async () => {
  const min = 1, max = 60;
  try {
    const v = await getRandom(min, max);
    console.log('Random.org returned:', v);
    if (v < min || v > max) {
      console.error('Fail: value out of range');
      process.exit(2);
    } else {
      console.log('OK: value in range');
      process.exit(0);
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
