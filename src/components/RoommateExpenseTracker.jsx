import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ExpenseTracker = () => {
  const defaultMonthData = {
    contributions: {
      Deidre: { rent: 0, utilities: 0 },
      Keanna: { rent: 0, utilities: 0 }
    },
    actualExpenses: {
      rent: 0,
      utilities: 0
    }
  };

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [currentExpenses, setCurrentExpenses] = useState(defaultMonthData);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem('roommate-expenses');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setMonthlyExpenses(parsedData);
      if (parsedData[selectedMonth]) {
        setCurrentExpenses(parsedData[selectedMonth]);
      } else {
        setCurrentExpenses(defaultMonthData);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('roommate-expenses', JSON.stringify(monthlyExpenses));
  }, [monthlyExpenses]);

  // Update current expenses when month changes
  useEffect(() => {
    setCurrentExpenses(monthlyExpenses[selectedMonth] || defaultMonthData);
  }, [selectedMonth]);

  const handleContributionChange = (name, type, value) => {
    const numValue = parseFloat(value) || 0;
    const updatedExpenses = {
      ...currentExpenses,
      contributions: {
        ...currentExpenses.contributions,
        [name]: {
          ...currentExpenses.contributions[name],
          [type]: numValue
        }
      }
    };
    setCurrentExpenses(updatedExpenses);
    setMonthlyExpenses(prev => ({
      ...prev,
      [selectedMonth]: updatedExpenses
    }));
  };

  const handleExpenseChange = (type, value) => {
    const numValue = parseFloat(value) || 0;
    const updatedExpenses = {
      ...currentExpenses,
      actualExpenses: {
        ...currentExpenses.actualExpenses,
        [type]: numValue
      }
    };
    setCurrentExpenses(updatedExpenses);
    setMonthlyExpenses(prev => ({
      ...prev,
      [selectedMonth]: updatedExpenses
    }));
  };

  const calculateTotalContributions = (type) => {
    return Object.values(currentExpenses.contributions).reduce((total, person) => total + person[type], 0);
  };

  const calculateBalance = (type) => {
    return calculateTotalContributions(type) - currentExpenses.actualExpenses[type];
  };

  // Generate array of last 12 months for the select dropdown
  const getLast12Months = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      months.push(monthStr);
    }
    return months;
  };

  const clearMonth = () => {
    setCurrentExpenses(defaultMonthData);
    setMonthlyExpenses(prev => ({
      ...prev,
      [selectedMonth]: defaultMonthData
    }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Roommate Expense Tracker</CardTitle>
        <div className="flex gap-4 items-center mt-4">
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded p-2"
          >
            {getLast12Months().map(month => (
              <option key={month} value={month}>
                {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
          <Button onClick={clearMonth} variant="outline">Clear Month</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Contributions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Deidre's Contributions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm">Rent ($)</label>
                      <Input
                        type="number"
                        value={currentExpenses.contributions.Deidre.rent || ''}
                        onChange={(e) => handleContributionChange('Deidre', 'rent', e.target.value)}
                        placeholder="Enter rent amount"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Utilities ($)</label>
                      <Input
                        type="number"
                        value={currentExpenses.contributions.Deidre.utilities || ''}
                        onChange={(e) => handleContributionChange('Deidre', 'utilities', e.target.value)}
                        placeholder="Enter utilities amount"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Keanna's Contributions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm">Rent ($)</label>
                      <Input
                        type="number"
                        value={currentExpenses.contributions.Keanna.rent || ''}
                        onChange={(e) => handleContributionChange('Keanna', 'rent', e.target.value)}
                        placeholder="Enter rent amount"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Utilities ($)</label>
                      <Input
                        type="number"
                        value={currentExpenses.contributions.Keanna.utilities || ''}
                        onChange={(e) => handleContributionChange('Keanna', 'utilities', e.target.value)}
                        placeholder="Enter utilities amount"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Total Contributions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm">Total Rent</label>
                      <div className="font-semibold">${calculateTotalContributions('rent').toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="text-sm">Total Utilities</label>
                      <div className="font-semibold">${calculateTotalContributions('utilities').toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Actual Expenses</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm">Rent ($)</label>
                  <Input
                    type="number"
                    value={currentExpenses.actualExpenses.rent || ''}
                    onChange={(e) => handleExpenseChange('rent', e.target.value)}
                    placeholder="Enter actual rent"
                  />
                </div>
                <div>
                  <label className="text-sm">Utilities ($)</label>
                  <Input
                    type="number"
                    value={currentExpenses.actualExpenses.utilities || ''}
                    onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                    placeholder="Enter actual utilities"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Balance Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Rent Balance</label>
                <div className={`font-semibold ${calculateBalance('rent') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${calculateBalance('rent').toFixed(2)}
                </div>
              </div>
              <div>
                <label className="text-sm">Utilities Balance</label>
                <div className={`font-semibold ${calculateBalance('utilities') >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${calculateBalance('utilities').toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;
