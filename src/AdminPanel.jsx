import React, { useEffect, useState } from 'react';

function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: '',
    description: '',
    quantity: '',
    price: ''
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    quantity: '',
    price: ''
  });
  
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetching products from server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/products?role=admin');
        if (!response.ok) {
          throw new Error('Brak dostępu lub błąd serwera');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setError('Brak produktów w bazie danych');
        }
      } catch (err) {
        setError(err.message || 'Błąd podczas ładowania produktów');
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
  
      if (!response.ok) {
        throw new Error('Błąd podczas aktualizacji produktu');
      }
  
      const updatedData = await response.json();
      console.log('Zaktualizowany produkt:', updatedData);
  
      // Odświeżenie strony po udanej edycji
      window.location.reload(); // Odświeżenie strony
  
    } catch (err) {
      setError(err.message || 'Błąd podczas aktualizacji produktu');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Błąd podczas usuwania produktu');
      }

      // Usuwanie produktu z lokalnego stanu
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      setError(err.message || 'Błąd podczas usuwania produktu');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Błąd podczas dodawania produktu');
      }

      const addedProduct = await response.json();
      setProducts([...products, addedProduct]); // Dodaj nowy produkt do listy
      setShowAddForm(false); // Zamknij formularz
      setNewProduct({ name: '', description: '', quantity: '', price: '' }); // Wyczyść formularz
    } catch (err) {
      setError(err.message || 'Błąd podczas dodawania produktu');
    }
  };

  return (
    <div>
      <h1>Lista produktów</h1>
      {error && <p>{error}</p>}

      <button onClick={() => setShowAddForm(true)}>Dodaj nowy produkt</button>

      {showAddForm && (
        <div>
          <h2>Dodaj nowy produkt</h2>
          <form onSubmit={handleAddProduct}>
            <div>
              <label>Nazwa produktu:</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Opis:</label>
              <input
                type="text"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Ilość:</label>
              <input
                type="number"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Cena:</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
            </div>
            <button type="submit">Dodaj produkt</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Anuluj</button>
          </form>
        </div>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>Nazwa produktu</th>
            <th>Opis</th>
            <th>Ilość</th>
            <th>Cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.price} zł</td>
              <td>
                <button onClick={() => handleEditClick(product)}>Edytuj</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
