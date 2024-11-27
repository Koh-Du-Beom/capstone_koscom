import db from '@/db';

export async function GET() {
  try {
    const users = db.prepare('SELECT id, email FROM users').all();
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id); // 삭제 쿼리 실행

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      status: 500,
    });
  }
}
