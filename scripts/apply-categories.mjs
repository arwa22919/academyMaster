// Additive, non-destructive migration for the new Sports activities and Expense
// categories. Extends the MySQL enum value lists ONLY — existing rows are kept.
//
// Use this INSTEAD of `drizzle-kit push`: push sees the schema's custom int(11)
// type (sessions_allowed/sessions_used) as a change from the DB's plain int and
// tries to recreate those columns by TRUNCATING tables — data loss unrelated to
// categories. This script avoids all that and only runs the three ALTERs.
//
// Run from the project root (needs DATABASE_URL, from .env or the environment):
//   node scripts/apply-categories.mjs

import 'dotenv/config';
import mysql from 'mysql2/promise';

const ACTIVITY = [
  'karate', 'kickboxing', 'football', 'swimming', 'zumba', 'aerobics', 'crossfit',
  'gymnastics', 'quran_memorization', 'kindergarten',
  'muay_thai', 'special_needs', 'aqua_aerobics', 'basketball', 'volleyball',
];
const CATEGORY = [
  'rent', 'utilities', 'maintenance', 'equipment', 'salary', 'marketing', 'transportation', 'other',
  'water', 'electricity', 'license_fees', 'residency_fees', 'sewage',
];

const enumList = (values) => values.map((v) => `'${v}'`).join(',');

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('❌ DATABASE_URL is not set. Add it to .env or the environment and retry.');
  process.exit(1);
}

const conn = await mysql.createConnection(url);
try {
  console.log('Extending enums (additive, non-destructive)…');
  await conn.query(`ALTER TABLE \`subscriptions\` MODIFY COLUMN \`activity\` ENUM(${enumList(ACTIVITY)}) NOT NULL`);
  await conn.query(`ALTER TABLE \`trainers\` MODIFY COLUMN \`activity\` ENUM(${enumList(ACTIVITY)}) NOT NULL`);
  await conn.query(`ALTER TABLE \`expenses\` MODIFY COLUMN \`category\` ENUM(${enumList(CATEGORY)}) NOT NULL`);
  console.log('✅ Done — new activities and expense categories are now accepted by the database.');
} catch (e) {
  console.error('❌ Migration failed:', e.code || '', e.sqlMessage || e.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
