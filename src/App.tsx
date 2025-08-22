import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Welcome from './pages/Welcome/Welcome';

function App() {
  return (
    <div className="App">
          <Navbar></Navbar>
          <Welcome></Welcome>
    </div>
  );
}

export default App;
