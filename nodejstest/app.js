const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(cors());

// MongoDB connection setup (replace with your MongoDB URI)
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/abdulmongo'; // Your MongoDB URI

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();



// Create a new item
app.post('/api/items', async (req, res) => {
    const item = req.body;
    const collection = client.db('abdulmongo').collection('user'); // Replace 'mydb' with your database name
  
    try {
      const result = await collection.insertOne(item);
      res.status(201).json(result.ops[0]);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Read all items
  app.get('/api/items', async (req, res) => {
    const collection = client.db('abdulmongo').collection('user');
  
    try {
      const items = await collection.find({}).toArray();

      console.log(items);

      res.json(items);
    } catch (error) {
      console.error('Error retrieving items:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    
    // res.json('this response2');

  });
  
  // Read a specific item by ID
  app.get('/api/items/:id', async (req, res) => {
    const id = req.params.id;
    const collection = client.db('abdulmongo').collection('user');
  
    try {
      const item = await collection.findOne({ _id: new mongodb.ObjectID(id) });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error retrieving item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update an item by ID
  app.put('/api/items/:id', async (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    const collection = client.db('mydb').collection('items');
  
    try {
      const result = await collection.updateOne(
        { _id: new mongodb.ObjectID(id) },
        { $set: updatedItem }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.json({ message: 'Item updated successfully' });
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete an item by ID
  app.delete('/api/items/:id', async (req, res) => {
    const id = req.params.id;
    const collection = client.db('mydb').collection('items');
  
    try {
      const result = await collection.deleteOne({ _id: new mongodb.ObjectID(id) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


