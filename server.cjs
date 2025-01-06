const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Włącz CORS z niestandardowymi opcjami
app.use(cors({
  origin: 'http://localhost:5173', // Adres Twojego frontendu
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Dozwolone metody
  allowedHeaders: ['Content-Type', 'Authorization'], // Dozwolone nagłówki
}));

// Middleware
app.use(express.json());

// Konfiguracja bazy danych
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school_shop',
});

db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

// Endpoint logowania
app.post('/login', (req, res) => {
  const { email, password } = req.body; // Zmień na 'email' zamiast 'username'

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Błąd bazy danych:', err);
      res.status(500).json({ message: 'Błąd serwera' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Logowanie powiodło się' });
    } else {
      res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
    }
  });
});

// Endpoint dla listy produktów (tylko admin)
app.get('/products', (req, res) => {
  const { role } = req.query;
  console.log('Received role:', role);  // Logowanie roli

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Brak dostępu' });
  }

  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Błąd bazy danych:', err);
      res.status(500).json({ message: 'Błąd serwera' });
      return;
    }

    console.log('Products fetched:', results);  // Logowanie wyników zapytania
    res.status(200).json(results);
  });
});

// Endpoint do aktualizacji produktu
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price } = req.body;

  const query = 'UPDATE products SET name = ?, description = ?, quantity = ?, price = ? WHERE id = ?';
  db.query(query, [name, description, quantity, price, id], (err, results) => {
    if (err) {
      console.error('Błąd bazy danych:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ id, name, description, quantity, price });
    } else {
      res.status(404).json({ message: 'Produkt nie znaleziony' });
    }
  });
});

// Endpoint do usuwania produktu
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Błąd bazy danych:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Produkt usunięty' });
    } else {
      res.status(404).json({ message: 'Produkt nie znaleziony' });
    }
  });
});

// Endpoint do dodawania nowego produktu
app.post('/products', (req, res) => {
  const { name, description, quantity, price } = req.body;

  // Zapytanie do dodania nowego produktu do bazy danych
  const query = 'INSERT INTO products (name, description, quantity, price) VALUES (?, ?, ?, ?)';
  db.query(query, [name, description, quantity, price], (err, results) => {
    if (err) {
      console.error('Błąd bazy danych:', err);
      return res.status(500).json({ message: 'Błąd serwera' });
    }

    const newProduct = {
      id: results.insertId,
      name,
      description,
      quantity,
      price,
    };
    res.status(201).json(newProduct); // Zwrócenie nowego produktu
  });
});

// Start serwera
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
