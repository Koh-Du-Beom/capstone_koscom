import db from "../../../../../db";
import bcrypt from 'bcrypt';

export async function POST(request){
  const { email, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);


  console.log(hashedPassword);
  
  try {
    const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
    stmt.run(email, hashedPassword);

    return new Response(JSON.stringify({ message: '회원가입 성공' }), { status: 201 });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return new Response(JSON.stringify({ message: '이미 존재하는 이메일입니다.' }), { status: 400 });
    }
    return new Response(JSON.stringify({ message: '회원가입 실패' }), { status: 500 });
  }

}