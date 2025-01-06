import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import AdminPanel from './AdminPanel'; // Zaimportuj komponent panelu admina
import Navbar from './Navbar'; // Zaimportuj navbar, jeśli chcesz go dodać do aplikacji
import 'bootstrap/dist/css/bootstrap.min.css'; // Importujemy Bootstrap CSS


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook do nawigacji

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Logowanie powiodło się!');
        navigate('/admin'); // Po udanym logowaniu przekierowujemy do panelu admina
      } else {
        setError(data.message || 'Logowanie nie powiodło się.');
      }
    } catch (err) {
      setError('Błąd podczas logowania. Spróbuj ponownie później.');
    }
  };

  return (
    <div className="App">
      <h1>Logowanie</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Nazwa użytkownika:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Hasło:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <Navbar /> {/* Dodajemy navbar do każdej strony */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;
