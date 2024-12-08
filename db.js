import Database from "better-sqlite3";
import { join } from 'path';

const db = new Database(join(process.cwd(), 'database.sqlite'));
db.prepare('PRAGMA foreign_keys = ON').run();

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
    FOREIGN KEY (user_id) REFERENCES users(email) ON DELETE CASCADE
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

db.prepare(`
  CREATE TABLE IF NOT EXISTS portfolios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    portfolio_title TEXT,
    scraps INTEGER,
    sharpe_ratio REAL,
    kelly_ratio REAL,
    mdd REAL,
    rate_return REAL,
    max_rate_return REAL,
    startDate TEXT,
    endDate TEXT,
    rebalancePeriod TEXT,
    method TEXT,
    startMoney TEXT,
    assets TEXT,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
  )
`).run();

export default db;

