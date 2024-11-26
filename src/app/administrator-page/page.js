'use client';

import React, { useState, useEffect } from 'react';
import classes from './page.module.css';

const AdministratorPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 유저 데이터를 가져오는 함수
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 유저 삭제 함수
  const deleteUser = async (id) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // 성공적으로 삭제한 후 UI 업데이트
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Administrator Page</h1>
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className={classes.error}>{error}</p>
      ) : (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    className={classes.deleteButton}
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdministratorPage;
