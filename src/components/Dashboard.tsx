'use client';

import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const paymentData = [
  { name: 'Paid', value: 400 },
  { name: 'Pending', value: 100 },
];

const loanData = [
  { name: 'User 1', LoanTaken: 5000, PendingEMI: 2 },
  { name: 'User 2', LoanTaken: 3000, PendingEMI: 1 },
  { name: 'User 3', LoanTaken: 7000, PendingEMI: 3 },
];

const installmentData = [
  { name: 'Pending Installments', value: 5 },
  { name: 'Completed Installments', value: 15 },
];

const Dashboard: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
      {/* Payment Status Pie Chart */}
      <div style={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
        <h3 style={{ textAlign: 'center' }}>Payment Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={paymentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {paymentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Loan Taken Bar Chart */}
      <div style={{ flex: 1, minWidth: 300, maxWidth: 500 }}>
        <h3 style={{ textAlign: 'center' }}>Loan Taken by Users</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={loanData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="LoanTaken" fill="#8884d8" name="Loan Taken" />
            <Bar dataKey="PendingEMI" fill="#FF8042" name="Pending EMI" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pending Installments Pie Chart */}
      <div style={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
        <h3 style={{ textAlign: 'center' }}>Installments</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={installmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {installmentData.map((entry, index) => (
                <Cell key={`cell2-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Dashboard;