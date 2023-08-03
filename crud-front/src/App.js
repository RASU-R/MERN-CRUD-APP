import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
const App = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        // Update existing item
        await axios.put(`http://localhost:5000/api/items/${editItemId}`, formData);
        const updatedItems = items.map((item) =>
          item._id === editItemId ? formData : item
        );
        setItems(updatedItems);
      } else {
        // Add new item
        const response = await axios.post('http://localhost:5000/api/items', formData);
        setItems([...items, response.data]);
      }
      setFormData({ name: '', description: '' });
      setEditItemId(null);
    } catch (err) {
      console.error('Error adding/updating item:', err);
    }
  };

  const handleEdit = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    setFormData({ name: itemToEdit.name, description: itemToEdit.description });
    setEditItemId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">CRUD App using MERN Stack</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-2 border rounded w-full mb-2"
          placeholder="Item Name"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="px-4 py-2 border rounded w-full mb-2"
          placeholder="Description"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editItemId ? 'Update Item' : 'Add Item'}
        </button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id} className="mb-2">
            <strong>{item.name}</strong> - {item.description}
            <button
              onClick={() => handleEdit(item._id)}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
