// OrdersPanel.jsx
import React, { useState, useEffect } from 'react';

function OrdersPanel() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Tutaj powinien być kod do pobierania zamówień (np. z serwera)
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Błąd podczas ładowania zamówień:', err);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Panel zamówień</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID zamówienia</th>
            <th>Data</th>
            <th>Użytkownik</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.user}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersPanel;
6