import Database from "better-sqlite3";
import { join } from 'path';

const db = new Database(join(process.cwd(), 'database.sqlite'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT  
  )  
`).run();

export default db;

