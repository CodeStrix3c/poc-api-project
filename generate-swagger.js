import fs from 'fs';
import path from 'path';
import { specs } from './swagger.js';

const outputPath = path.join(process.cwd(), 'swagger.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf8');
  console.log(`✓ swagger.json generated successfully at ${outputPath}`);
} catch (error) {
  console.error('✗ Error generating swagger.json:', error.message);
  process.exit(1);
}
