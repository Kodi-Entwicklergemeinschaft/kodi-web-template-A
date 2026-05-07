// import fs from 'fs';
// import path from 'path';

// const localesDir = path.resolve('./src/translation');
// const baseLang = 'en';
// const basePath = path.join(localesDir, `${baseLang}.json`);
// const outputFile = path.join(localesDir, 'translation.ts');

// // Read base (English) JSON
// const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

// // Generate TS interface lines
// const keys = Object.keys(base);
// const schemaLines = keys.map((key) => `  ${key}: string;`);
// const schema = `// ⚙️ Auto-generated from ${baseLang}.json\n// Do not edit manually\n\nexport interface TranslationSchema {\n${schemaLines.join(
//   '\n'
// )}\n}\n`;

// // Write interface file
// fs.writeFileSync(outputFile, schema);
// console.log(`✅ Generated: ${path.relative(process.cwd(), outputFile)}`);

// import fs from 'fs';
// import path from 'path';

// const localesDir = path.resolve('./src/translation');
// const baseLang = 'en';
// const basePath = path.join(localesDir, `${baseLang}.json`);
// const outputFile = path.join(localesDir, 'translation.ts');

// const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

// // Recursive function to generate interface lines
// function generateInterface(obj, indent = 2) {
//   const spaces = ' '.repeat(indent);
//   if (Array.isArray(obj)) {
//     if (obj.length === 0) return 'any[]';
//     // Assume homogeneous array; use first item to infer type
//     return `${generateInterface(obj[0], indent)}[]`;
//   } else if (typeof obj === 'object' && obj !== null) {
//     const lines = Object.entries(obj).map(([key, value]) => {
//       return `${spaces}${key}: ${generateInterface(value, indent + 2)};`;
//     });
//     return `{\n${lines.join('\n')}\n${spaces.slice(2)}}`;
//   } else {
//     return 'string'; // fallback for primitives
//   }
// }

// // Build TypeScript interface
// const interfaceString = `// ⚙️ Auto-generated from ${baseLang}.json
// // Do not edit manually

// export interface TranslationSchema ${generateInterface(base)};
// `;

// // Write to file
// fs.writeFileSync(outputFile, interfaceString, 'utf-8');
// console.log(`✅ Generated: ${path.relative(process.cwd(), outputFile)}`);

import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('./src/translation');
const baseLang = 'en';
const basePath = path.join(localesDir, `${baseLang}.json`);
const outputFile = path.join(localesDir, 'translation.ts');

const base = JSON.parse(fs.readFileSync(basePath, 'utf-8'));

// Recursive function to generate interface lines
function generateInterface(obj, indent = 2) {
  const spaces = ' '.repeat(indent);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'any[]';
    return `${generateInterface(obj[0], indent)}[]`;
  } else if (typeof obj === 'object' && obj !== null) {
    const lines = Object.entries(obj).map(([key, value]) => {
      return `${spaces}${key}: ${generateInterface(value, indent + 2)};`;
    });
    return `{\n${lines.join('\n')}\n${spaces.slice(2)}}`;
  } else {
    return 'string';
  }
}

// Recursive function to generate dot-notated keys
function generateKeys(obj, prefix = '') {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return [];
    // Recursively take keys from first element of array
    return generateKeys(obj[0], prefix);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).flatMap(([key, value]) => {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      return generateKeys(value, newPrefix);
    });
  } else {
    return [prefix];
  }
}

// Generate TypeScript interface
const interfaceString = `// ⚙️ Auto-generated from ${baseLang}.json
// Do not edit manually

export interface TranslationSchema ${generateInterface(base)};

export type TranslationKey = ${generateKeys(base)
  .map((k) => `'${k}'`)
  .join(' | ')};
`;

// Write file
fs.writeFileSync(outputFile, interfaceString, 'utf-8');
console.log(`✅ Generated: ${path.relative(process.cwd(), outputFile)}`);
