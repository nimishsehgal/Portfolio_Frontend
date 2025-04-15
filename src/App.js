import React, { useState } from 'react';
import StockSelector from './components/StockSelector';

function App() {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async () => {
    const stockList = selectedStocks.map(stock => stock.value);
  
    const formData = new FormData();
    stockList.forEach(stock => formData.append('selected_stocks', stock));
    formData.append('investment_amount', investmentAmount);
    formData.append('investment_period', investmentPeriod);
  
    try {
      const response = await fetch('http://localhost:8000/equal-weight-portfolio/', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
      setResults(result.results);  // <== this stores backend data for rendering
    } catch (err) {
      console.error("Error sending data to backend", err);
    }
  };
  

  return (
    <div className="App" style={{ padding: '30px' }}>
      <h1>Stock Portfolio Builder</h1>
  
      <StockSelector
        selectedStocks={selectedStocks}
        setSelectedStocks={setSelectedStocks}
      />
  
      <div style={{ marginTop: '20px' }}>
        <h2>Total Investment Amount (₹):</h2>
        <input
          type="number"
          value={investmentAmount}
          onChange={(e) => setInvestmentAmount(e.target.value)}
          placeholder="Enter amount (e.g., 10000)"
        />
      </div>
  
      <div style={{ marginTop: '20px' }}>
        <h2>Investment Period (in days):</h2>
        <input
          type="number"
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(e.target.value)}
          placeholder="Enter number of days (e.g., 90)"
        />
      </div>
  
      <button onClick={handleSubmit} style={{ marginTop: '30px' }}>
        Submit
      </button>
  
      {/* 🎯 Display results below the submit button */}
      {results && (
        <div style={{ marginTop: '40px' }}>
          <h2>Portfolio Optimization Results</h2>
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
}

export default App;
