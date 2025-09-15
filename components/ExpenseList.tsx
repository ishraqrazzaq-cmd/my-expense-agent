import React from 'react';
import { Expense } from '../types';
import { DownloadIcon } from '../icons/DownloadIcon';

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
  const exportToCsv = () => {
    // --- UPDATE CSV HEADERS ---
    const headers = 'Date,Description,Value,Category\n';
    // --- UPDATE CSV ROWS to include the value ---
    const rows = expenses.map(e => `${e.date},"${e.description.replace(/"/g, '""')}",${e.value},"${e.category}"`).join('\n');
    
    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (expenses.length === 0) {
    return <p style={{ textAlign: 'center', color: '#666' }}>No expenses added yet.</p>;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
         <button onClick={exportToCsv} style={{ padding: '0.5rem 1rem', border: '1px solid #28a745', backgroundColor: 'transparent', color: '#28a745', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DownloadIcon />
            Export to CSV
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Description</th>
            {/* --- ADD NEW VALUE HEADER --- */}
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>Category</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{exp.date}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{exp.description}</td>
              {/* --- ADD NEW VALUE CELL --- */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{exp.value}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{exp.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ExpenseList;
