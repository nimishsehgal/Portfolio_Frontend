// src/components/StockSelector.js
import React from 'react';
import Select from 'react-select';
import { nifty50Stocks } from '../data/nifty50';

const options = nifty50Stocks.map(stock => ({
  value: stock,
  label: stock
}));

const StockSelector = ({ selectedStocks, setSelectedStocks }) => {
  return (
    <div>
      <h2>Select Stocks to Invest In:</h2>
      <Select
        options={options}
        isMulti
        onChange={setSelectedStocks}
        value={selectedStocks}
      />
    </div>
  );
};

export default StockSelector;
