/* eslint-env node */
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3005;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());

// Mock users data
let usersData = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Fatma Demir',
    email: 'fatma@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

// Routes
app.get('/api/users', (req, res) => {
  try {
    const { role, status, search } = req.query;
    let filteredData = [...usersData];
    
    if (role) {
      filteredData = filteredData.filter(user => user.role === role);
    }
    
    if (status) {
      filteredData = filteredData.filter(user => user.status === status);
    }
    
    if (search) {
      filteredData = filteredData.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    const newUser = {
      id: usersData.length + 1,
      name,
      email,
      role: role || 'user',
      status: status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    usersData.push(newUser);
    
    console.log('New user added:', newUser);
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ success: false, message: 'Failed to add user' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const userIndex = usersData.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    usersData[userIndex] = {
      ...usersData[userIndex],
      ...updates,
      lastLogin: new Date().toISOString()
    };
    
    res.json({ success: true, data: usersData[userIndex] });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const userIndex = usersData.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    usersData.splice(userIndex, 1);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Users API error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
if (NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Users API server running on port ${PORT}`);
  });
}

module.exports = app;
