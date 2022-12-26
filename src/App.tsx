import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Select, { SelectOptions } from './components/Select';

const options = [
  {
    label: 'label1',
    value: 'value1'
  },
  {
    label: 'label2',
    value: 'value2'
  },
  {
    label: 'label3',
    value: 'value3'
  }
]
function App() {
  const [value, setValue] = useState<SelectOptions | undefined>(options[0]);
  const [multiValue, setMultivalue] = useState<SelectOptions[]>([])
  return (
    <div className="App">
      <Select value={value} onChange={(v)=>setValue(v)} options={options} />
      <Select value={multiValue} multiple={true} onChange={(v) => setMultivalue(v ? v : [])} options={options} />
    </div>
  );
}

export default App;
