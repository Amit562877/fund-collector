'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

function generateTempPassword(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

type User = {
  id: string;
  name: string;
  mobile: string;
};

const USERS_PER_PAGE = 5;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);

  // Fetch users from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "Users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList: User[] = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        mobile: doc.data().mobile,
      }));
      setUsers(userList);
    });
    return () => unsubscribe();
  }, []);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\d{10}$/.test(mobile)) {
      setMessage('Enter a valid name and 10-digit mobile number');
      return;
    }
    const tempPassword = generateTempPassword();

    await addDoc(collection(db, "Users"), {
      name: name.trim(),
      mobile,
      tempPassword,
      createdAt: new Date()
    });

    setName('');
    setMobile('');
    setMessage('User added successfully! Temp password sent.');
    setPage(1);
  };

  // Pagination logic
  const paginatedUsers = users.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE
  );

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Users</h2>

      {/* Add User Form */}
      <form
        onSubmit={handleAddUser}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          marginBottom: '2rem',
        }}
      >
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            required
          />
        </label>
        <label>
          Mobile Number
          <input
            type="tel"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Enter 10-digit mobile"
            pattern="\d{10}"
            maxLength={10}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
            required
          />
        </label>
        <button
          type="submit"
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.75rem',
            fontWeight: 'bold',
          }}
        >
          Add User
        </button>
        {message && (
          <div style={{ color: '#1976d2', textAlign: 'center' }}>{message}</div>
        )}
      </form>

      {/* Users Table */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>User List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th>Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{user.name}</td>
                  <td>{user.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #1976d2',
              background: page === 1 ? '#eee' : '#1976d2',
              color: page === 1 ? '#888' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Prev
          </button>
          <span style={{ alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: '1px solid #1976d2',
              background: page === totalPages ? '#eee' : '#1976d2',
              color: page === totalPages ? '#888' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;