import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('./src/translation');
const baseLang = 'en';
const basePath = path.join(localesDir, `${baseLang}.json`);

const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
const baseKeys = Object.keys(base);

const files = fs
  .readdirSync(localesDir)
  .filter((f) => f.endsWith('.json') && f !== `${baseLang}.json`);

let isValid = true;

for (const file of files) {
  const lang = file.replace('.json', '');
  const content = JSON.parse(
    fs.readFileSync(path.join(localesDir, file), 'utf-8')
  );
  const contentKeys = Object.keys(content);

  const missing = baseKeys.filter((k) => !contentKeys.includes(k));
  const extra = contentKeys.filter((k) => !baseKeys.includes(k));

  if (missing.length > 0) {
    console.error(`❌ ${lang}.json is missing keys:`, missing);
    isValid = false;
  }

  if (extra.length > 0) {
    console.error(
      `⚠️ ${lang}.json has extra keys:`,
      extra,
      '\n',
      'Please remove them. \n OR  \n update : ',
      extra,
      'in other json files.'
    );
    isValid = false;
  }
}

if (!isValid) {
  process.exit(1);
}

console.log('✅ All translation files are consistent.');
