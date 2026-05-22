const fs = require('fs');
let content = fs.readFileSync('src/utils/data.js', 'utf8');

// First replace price10 of hamper
content = content.replace(/id:\s*'hamper'[\s\S]*?price10:\s*\d+/, (match) => match.replace(/price10:\s*\d+/, 'price10: 2999'));
content = content.replace(/id:\s*'hamper'[\s\S]*?price12:\s*\d+/, (match) => match.replace(/price12:\s*\d+/, 'price12: 2999'));

// Then replace all originalPrice with price10 + 200 (or +300 for bouquet/hamper)
content = content.replace(/id:\s*'([^']+)'[\s\S]*?price10:\s*(\d+),[\s\S]*?originalPrice:\s*(\d+),/g, (match, id, price) => {
    const p = parseInt(price);
    const increase = (id === 'hamper' || id === 'bouquet') ? 300 : 200;
    return match.replace(/originalPrice:\s*\d+,/, `originalPrice: ${p + increase},`);
});

fs.writeFileSync('src/utils/data.js', content);
