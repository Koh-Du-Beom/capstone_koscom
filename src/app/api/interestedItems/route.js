import db from '@/db';

//관심종목 추가하기
export async function POST(request) {
  const { email, name, code, marketCategory } = await request.json();

  try {
    const stmt = db.prepare(`
      INSERT INTO interestedItems (user_id, name, code, marketCategory)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(email, name, code, marketCategory);

    return new Response(JSON.stringify({ message: '관심 종목이 추가되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error('Failed to insert interested item:', error.message);
    return new Response(JSON.stringify({ message: '관심 종목 추가에 실패했습니다.' }), { status: 500 });
  }
}

// 관심종목 불러오기
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  try {
    const stmt = db.prepare(`
      SELECT name, code, marketCategory
      FROM interestedItems
      WHERE user_id = ?
    `);
    const results = stmt.all(email);

    return new Response(JSON.stringify({ items: results }), { status: 200 });
  } catch (error) {
    console.error('Failed to fetch interested items:', error.message);
    return new Response(JSON.stringify({ message: 'Failed to fetch interested items' }), { status: 500 });
  }
}

//관심종목 삭제하기
export async function DELETE(request) {
  const { email, code } = await request.json();

  try {
    const stmt = db.prepare(`
      DELETE FROM interestedItems
      WHERE user_id = ? AND code = ?
    `);
    stmt.run(email, code);

    return new Response(JSON.stringify({ message: '관심 종목이 삭제되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error('Failed to delete interested item:', error.message);
    return new Response(JSON.stringify({ message: '관심 종목 삭제에 실패했습니다.' }), { status: 500 });
  }
}
