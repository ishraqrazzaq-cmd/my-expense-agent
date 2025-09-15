import { useState } from 'react';
import { Expense } from './types';
import { categorizeExpense } from './services/geminiService';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddExpense = async (description: string) => {
    if (!description) return;
    setIsLoading(true);
    setError(null);
    try {
      const category = await categorizeExpense(description);
      const newExpense: Expense = {
        description,
        category,
        date: new Date().toLocaleDateString(),
      };
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
    } catch (err) {
      setError('Failed to categorize expense. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '768px', margin: 'auto', padding: '1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Expense Categorization Agent</h1>
      </header>
      <main>
        <ExpenseForm onAddExpense={handleAddExpense} isLoading={isLoading} />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <ExpenseList expenses={expenses} />
      </main>
    </div>
  );
}

export default App;
