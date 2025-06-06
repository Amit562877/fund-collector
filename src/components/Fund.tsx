'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";

type Fund = {
  id: string;
  userId: string;
  amount: number;
  dateTime: string;
  status: 'pending' | 'approved';
  createdTime: string;
};

const Funds: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  // Fetch funds from Firestore in real-time
  useEffect(() => {
    const q = query(collection(db, "funds"), orderBy("createdTime", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fundList: Fund[] = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        amount: doc.data().amount,
        dateTime: doc.data().dateTime,
        status: doc.data().status,
        createdTime: doc.data().createdTime,
      }));
      setFunds(fundList);
    });
    return () => unsubscribe();
  }, []);

  // Add Fund Handler
  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !amount || !dateTime) {
      setMessage('Please fill all fields');
      return;
    }
    await addDoc(collection(db, "funds"), {
      userId: userId.trim(),
      amount: Number(amount),
      dateTime,
      status: 'pending',
      createdTime: new Date().toISOString(),
    });
    setUserId('');
    setAmount('');
    setDateTime('');
    setMessage('Fund added and pending approval.');
  };

  // (Optional) Admin: Approve Fund
  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "funds", id), { status: 'approved' });
    setMessage('Fund approved!');
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Funds</h2>

      {/* Add Fund Form */}
      <form
        onSubmit={handleAddFund}
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
          User ID
          <input
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            placeholder="Enter User ID"
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter Amount"
            required
            min={1}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label>
          Date & Time
          <input
            type="datetime-local"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
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
          Add Fund
        </button>
        {message && (
          <div style={{ color: '#1976d2', textAlign: 'center' }}>{message}</div>
        )}
      </form>

      {/* Fund List */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Fund List</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                <th>User ID</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Created Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {funds.map(fund => (
                <tr key={fund.id} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                  <td>{fund.userId}</td>
                  <td>₹{fund.amount}</td>
                  <td>{fund.dateTime.replace('T', ' ')}</td>
                  <td style={{ color: fund.status === 'approved' ? 'green' : '#FF8042', fontWeight: 'bold' }}>
                    {fund.status.charAt(0).toUpperCase() + fund.status.slice(1)}
                  </td>
                  <td>{new Date(fund.createdTime).toLocaleString()}</td>
                  <td>
                    {fund.status === 'pending' && (
                      <button
                        onClick={() => handleApprove(fund.id)}
                        style={{
                          background: '#00C49F',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '0.3rem 0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Funds;