import React, { useState } from 'react';
import { SpinnerIcon } from '../icons/SpinnerIcon';

interface ExpenseFormProps {
  onAddExpense: (description: string) => void;
  isLoading: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, isLoading }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense(description);
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g., BFC chicken 300 BDT"
        style={{ flexGrow: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 1.5rem', border: 'none', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {isLoading && <SpinnerIcon />}
        {isLoading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
