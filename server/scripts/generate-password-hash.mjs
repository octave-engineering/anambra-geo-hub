#!/usr/bin/env node
/**
 * Generate bcrypt password hashes for user accounts
 * Usage: node generate-password-hash.mjs [password]
 */

import bcrypt from 'bcrypt';

const password = process.argv[2] || 'admin123';
const saltRounds = 10;

console.log('Generating password hash...');
console.log('Password:', password);

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('Hash:', hash);
  console.log('\nAdd this to your SQL INSERT statement:');
  console.log(`'${hash}'`);
});
