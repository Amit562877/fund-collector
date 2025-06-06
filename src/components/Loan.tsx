'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Loan = {
  id: number;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
  emisPaid: number;
  totalEmis: number;
  pendingAmount: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const mockLoans: Loan[] = [
  { id: 1, amount: 10000, status: 'approved', emisPaid: 8, totalEmis: 12, pendingAmount: 3333 },
  { id: 2, amount: 5000, status: 'pending', emisPaid: 0, totalEmis: 6, pendingAmount: 5000 },
];

const Loans: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [message, setMessage] = useState('');

  // Calculate totals
  const totalLoan = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPending = loans.reduce((sum, loan) => sum + loan.pendingAmount, 0);

  // Chart data
  const statusData = [
    { name: 'Approved', value: loans.filter(l => l.status === 'approved').length },
    { name: 'Pending', value: loans.filter(l => l.status === 'pending').length },
    { name: 'Rejected', value: loans.filter(l => l.status === 'rejected').length },
  ];

  const emiData = loans.map(loan => ({
    name: `Loan #${loan.id}`,
    Paid: loan.emisPaid,
    Pending: loan.totalEmis - loan.emisPaid,
  }));

  const handleRequestLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanAmount || isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      setMessage('Enter a valid loan amount');
      return;
    }
    const newLoan: Loan = {
      id: loans.length + 1,
      amount: Number(loanAmount),
      status: 'pending',
      emisPaid: 0,
      totalEmis: 12,
      pendingAmount: Number(loanAmount),
    };
    setLoans([newLoan, ...loans]);
    setLoanAmount('');
    setMessage('Loan request submitted!');
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Loan Takers</h2>

      {/* Charts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {/* Loan Status Pie Chart */}
        <div style={{ flex: 1, minWidth: 250, maxWidth: 350 }}>
          <h4 style={{ textAlign: 'center' }}>Loan Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* EMI Progress Bar Chart */}
        <div style={{ flex: 1, minWidth: 250, maxWidth: 350 }}>
          <h4 style={{ textAlign: 'center' }}>EMI Progress</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={emiData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Paid" stackId="a" fill="#00C49F" />
              <Bar dataKey="Pending" stackId="a" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Loan Form */}
      <form onSubmit={handleRequestLoan} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        background: '#fff',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        marginBottom: '2rem'
      }}>
        <label>
          Request Loan Amount
          <input
            type="number"
            value={loanAmount}
            onChange={e => setLoanAmount(e.target.value)}
            placeholder="Enter amount"
            min={1}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
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
            fontWeight: 'bold'
          }}
        >
          Request Loan
        </button>
        {message && <div style={{ color: '#1976d2', textAlign: 'center' }}>{message}</div>}
      </form>

      {/* Loan Summary */}
      <div style={{
        background: '#f5f5f5',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div><strong>Total Loan Amount:</strong> ₹{totalLoan}</div>
        <div><strong>Total Pending Amount:</strong> ₹{totalPending}</div>
      </div>

      {/* Loan History */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Loan History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#1976d2', color: '#fff' }}>
                <th style={{ padding: '0.5rem' }}>Amount</th>
                <th>Status</th>
                <th>EMIs Paid</th>
                <th>Total EMIs</th>
                <th>Pending Amount</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(loan => (
                <tr key={loan.id} style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>₹{loan.amount}</td>
                  <td>{loan.status}</td>
                  <td>{loan.emisPaid}</td>
                  <td>{loan.totalEmis}</td>
                  <td>₹{loan.pendingAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loans;