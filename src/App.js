import React, { useState } from 'react';
import StockSelector from './components/StockSelector';

function App() {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');

  const handleSubmit = () => {
    const stockList = selectedStocks.map(stock => stock.value);
    console.log("Selected stocks:", stockList);
    console.log("Investment amount:", investmentAmount);
    console.log("Investment period (days):", investmentPeriod);

    // Send data to backend later
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
    </div>
  );
}

export default App;
