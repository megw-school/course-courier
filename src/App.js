import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/home';
import SettingsPage from './pages/settings';
import { useState } from 'react';

function App() {

  return (
    <div className="app">
      <Router>
          <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/settings" element={<SettingsPage />}></Route>
        </Routes>
      </Router>


      <footer className="app-footer">
        © 2023 Megan Wooley
      </footer>
    </div>
  );
}

export default App;
