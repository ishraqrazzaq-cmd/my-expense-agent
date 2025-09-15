import { useState } from 'react';
import { Expense } from './types';
// We don't need categorizeExpense service anymore, the logic is simpler now.
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
      // The fetch call now expects a full JSON object back from the API
      const response = await fetch('/api/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expense: description }),
      });

      if (!response.ok) {
        // Handle cases where the API returns an error (like 500)
        throw new Error('API request failed');
      }

      const data = await response.json();

      const newExpense: Expense = {
        date: new Date().toLocaleDateString(),
        description: data.description, // Use the cleaned description from the AI
        category: data.category,
        value: data.value,
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
