import React, { useState } from 'react';
import StockSelector from './components/StockSelector';

function App() {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [targetRisk, setTargetRisk] = useState('');
  const [optimizationMode, setOptimizationMode] = useState('equal');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (selectedStocks.length === 0) {
      setError("Please select at least one stock");
      return;
    }
    if (!investmentAmount || investmentAmount <= 0) {
      setError("Please enter a valid investment amount");
      return;
    }
    if (!investmentPeriod || investmentPeriod <= 0) {
      setError("Please enter a valid investment period");
      return;
    }
    if (optimizationMode === 'mean-variance' && (!targetRisk || targetRisk <= 0)) {
      setError("Please enter a valid target risk");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const stockList = selectedStocks.map(stock => stock.value);
      const formData = new FormData();
      stockList.forEach(stock => formData.append('selected_stocks', stock));
      formData.append('investment_amount', investmentAmount);
      formData.append('investment_period', investmentPeriod);
      if (optimizationMode === 'mean-variance') {
        formData.append('target_risk', targetRisk);
      }

      const url = optimizationMode === 'equal'
        ? 'http://localhost:8000/equal-weight-cumsum-plot/'
        : optimizationMode === 'minimum-risk'
        ? 'http://localhost:8000/minimum-risk-optimization/'
        : 'http://localhost:8000/mean-variance-optimization/';

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setResults(result);
    } catch (err) {
      setError("Failed to fetch portfolio data. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1300px', margin: '0 auto' }}>
      <h1>Portfolio Optimizer</h1>

      <label>Optimization Mode:</label>
      <select value={optimizationMode} onChange={e => setOptimizationMode(e.target.value)}>
        <option value="equal">Equal Weighted</option>
        <option value="mean-variance">Mean-Variance Optimization</option>
        <option value="minimum-risk">Minimum-Risk Optimization</option>
      </select>

      <StockSelector selectedStocks={selectedStocks} setSelectedStocks={setSelectedStocks} />

      <div style={{ marginBottom: '10px' }}>
        <label>Total Investment Amount ($):</label>
        <input
          type="number"
          value={investmentAmount}
          onChange={e => setInvestmentAmount(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Investment Period (days):</label>
        <input
          type="number"
          value={investmentPeriod}
          onChange={e => setInvestmentPeriod(e.target.value)}
        />
      </div>

      {optimizationMode === 'mean-variance' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Target Risk (σ):</label>
          <input
            type="number"
            step="0.01"
            value={targetRisk}
            onChange={e => setTargetRisk(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Optimize'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

      {results && (
        <div style={{ marginTop: '20px' }}>
          <h2>
            Results for {
              optimizationMode === 'equal' ? 'Equal Weighted' :
              optimizationMode === 'mean-variance' ? 'Mean-Variance' :
              'Minimum-Risk'
            } Portfolio
          </h2>

          <img
            src={`data:image/png;base64,${results.plot_base64}`}
            alt="Results Plot"
            style={{ maxWidth: '100%' }}
          />

          <p><strong>Final Value:</strong> ${results.final_value.toFixed(2)}</p>
          <p><strong>Total Return:</strong> {results.percent_return?.toFixed(2) || results.total_return?.toFixed(2)}%</p>

          {results.weights && (
            <div>
              <h3>Optimal Weights</h3>
              <ul>
                {Object.entries(results.weights).map(([stock, weight]) => (
                  <li key={stock}>{stock}: {(weight * 100).toFixed(2)}%</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
