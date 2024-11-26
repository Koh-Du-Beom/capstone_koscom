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

/* InterestedItems 테이블 생성 */
db.prepare(`
  CREATE TABLE IF NOT EXISTS interestedItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name TEXT,
    code TEXT,
    marketCategory TEXT,
    FOREIGN KEY (user_id) REFERENCES users(email)
  )
`).run();

/* user_id에 인덱스 생성 */
db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_interesteditems_user_id ON InterestedItems(user_id)
`).run();

/* 동일한 유저가 동일한 종목을 중복 추가하지 못하도록 UNIQUE 제약 조건 추가 */
db.prepare(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_user_code ON InterestedItems(user_id, code)
`).run();

export default db;

