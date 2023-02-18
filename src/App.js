import React, { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);

  // const [rates, setRates] = useState({});
  // используется потому что useState это асинхронное действие, т.е функция еще не знает о том что state изменился, даже если мы вызвали в начале вызвали функцию изменения stata слудующая функция не будет знать что state изменился, она узнает изменение только когда произойдет перересовка произойдет => поэтому лучше использовать в таких случаях useRef чтобы данные моментально передавались
  const retesRef = useRef({});

  useEffect(() => {
    fetch('http://localhost:3000/rates.json')
      .then((res) => res.json())
      .then((json) => {
        // setRates(json.rates);
        retesRef.current = json.rates;
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert('Не удалость получить информацию');
      });
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / retesRef.current[fromCurrency];
    const result = price * retesRef.current[toCurrency];
    setToPrice(result.toFixed(3));
    setFromPrice(value);
  };

  const onChangeToPrice = (value) => {
    const result = (retesRef.current[fromCurrency] / retesRef.current[toCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeValue={onChangeFromPrice}
        onChangeCurrency={setFromCurrency}
      />
      <Block value={toPrice} currency={toCurrency} onChangeCurrency={setToCurrency} onChangeValue={onChangeToPrice} />
    </div>
  );
}

export default App;
