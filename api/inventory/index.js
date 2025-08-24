/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Mock inventory data
let inventoryData = [
  {
    id: 1,
    name: 'Gıda Paketi',
    category: 'Gıda',
    quantity: 150,
    unit: 'adet',
    minQuantity: 50,
    location: 'Depo A',
    lastUpdated: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 2,
    name: 'İlaç Paketi',
    category: 'Sağlık',
    quantity: 75,
    unit: 'kutu',
    minQuantity: 25,
    location: 'Depo B',
    lastUpdated: new Date().toISOString(),
    status: 'active'
  }
];

// Routes
app.get('/api/inventory', (req, res) => {
  try {
    const { category, status, search } = req.query;
    let filteredData = [...inventoryData];
    
    if (category) {
      filteredData = filteredData.filter(item => item.category === category);
    }
    
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }
    
    if (search) {
      filteredData = filteredData.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory' });
  }
});

app.post('/api/inventory', (req, res) => {
  try {
    const { name, category, quantity, unit, minQuantity, location } = req.body;
    
    const newItem = {
      id: inventoryData.length + 1,
      name,
      category,
      quantity: parseInt(quantity),
      unit,
      minQuantity: parseInt(minQuantity),
      location,
      lastUpdated: new Date().toISOString(),
      status: 'active'
    };
    
    inventoryData.push(newItem);
    
    console.log('New inventory item added:', newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({ success: false, message: 'Failed to add inventory item' });
  }
});

app.put('/api/inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const itemIndex = inventoryData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    inventoryData[itemIndex] = {
      ...inventoryData[itemIndex],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({ success: true, data: inventoryData[itemIndex] });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ success: false, message: 'Failed to update inventory item' });
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const itemIndex = inventoryData.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    inventoryData.splice(itemIndex, 1);
    
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete inventory item' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Inventory API error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Inventory API server running on port ${PORT}`);
  });
}

module.exports = app;
