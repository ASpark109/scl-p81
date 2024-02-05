import './App.css';
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import DevelopmentArea from './components/DevelopmentArea/DevelopmentArea';

function App() {
  return (
    <div className="AppRoot">
      <Navbar />
      <DevelopmentArea />
    </div>
  );
}

export default App;