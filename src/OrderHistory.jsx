import React, { useState, useEffect } from 'react';

function OrderHistory() {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    // Tutaj powinien być kod do pobierania historii zamówień (np. z serwera)
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/order-history');
        const data = await response.json();
        setOrderHistory(data);
      } catch (err) {
        console.error('Błąd podczas ładowania historii zamówień:', err);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div>
      <h1>Historia zamówień</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID zamówienia</th>
            <th>Data</th>
            <th>Status</th>
            <th>Kwota</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
              <td>{order.amount} zł</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
