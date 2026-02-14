const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./db');
const config = require('./config');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve HTML files without .html extension
app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'public', `${page}.html`);
  res.sendFile(filePath, err => {
    if (err) next();
  });
});

// Database Endpoints
app.get('/api/config', async (req, res) => {
  try {
    const db = await connectDB();
    const settings = await db.collection('settings').findOne({ type: 'general' });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/config', async (req, res) => {
  const { password, settings } = req.body;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  try {
    const db = await connectDB();
    await db.collection('settings').updateOne(
      { type: 'general' },
      { $set: { ...settings, type: 'general' } },
      { upsert: true }
    );
    res.send('Updated');
  } catch (err) {
    res.status(500).send('Database error');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const db = await connectDB();
    const posts = await db.collection('posts').find().sort({ date: -1 }).toArray();
    console.log('Fetched posts count:', posts.length);
    res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    res.json([]);
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { content, image, avatar } = req.body;
    if (!content) return res.status(400).send('Content is required');
    
    const post = { 
      content, 
      image, 
      avatar, 
      date: new Date(), 
      likes: [], 
      comments: [] 
    };
    const db = await connectDB();
    const result = await db.collection('posts').insertOne(post);
    res.json({ ...post, _id: result.insertedId });
  } catch (err) {
    console.error('Post creation error:', err);
    res.status(500).send('Database error');
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const { ObjectId } = require('mongodb');
    const db = await connectDB();
    const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
    if (!post) return res.status(404).send('Post not found');
    
    const likes = post.likes || [];
    const index = likes.indexOf(userId);
    if (index === -1) {
      likes.push(userId);
    } else {
      likes.splice(index, 1);
    }
    
    await db.collection('posts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { likes } }
    );
    res.json({ likes });
  } catch (err) {
    res.status(500).send('Error');
  }
});

app.post('/api/posts/:id/comment', async (req, res) => {
  try {
    const { text, user } = req.body;
    const { ObjectId } = require('mongodb');
    const db = await connectDB();
    const comment = { id: Date.now().toString(), text, user, date: new Date() };
    await db.collection('posts').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: comment } }
    );
    res.json(comment);
  } catch (err) {
    res.status(500).send('Error');
  }
});

app.get('/share/sosial/:id', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } catch (err) {
    res.redirect('/');
  }
});

// Catalog Endpoints
app.get('/api/products', async (req, res) => {
  const db = await connectDB();
  const products = await db.collection('products').find().toArray();
  res.json(products);
});

app.post('/api/admin/products', async (req, res) => {
  const { password, product } = req.body;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  const db = await connectDB();
  await db.collection('products').insertOne(product);
  res.send('Added');
});

app.delete('/api/admin/products/:id', async (req, res) => {
  const { password } = req.query;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  const { ObjectId } = require('mongodb');
  const db = await connectDB();
  await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
  res.send('Deleted');
});

// Dynamic Links Endpoints
app.get('/api/links', async (req, res) => {
  const db = await connectDB();
  const links = await db.collection('links').find().toArray();
  res.json(links);
});

app.post('/api/admin/links', async (req, res) => {
  const { password, link } = req.body;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  const db = await connectDB();
  await db.collection('links').insertOne(link);
  res.send('Added');
});

app.delete('/api/admin/links/:id', async (req, res) => {
  const { password } = req.query;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  const { ObjectId } = require('mongodb');
  const db = await connectDB();
  await db.collection('links').deleteOne({ _id: new ObjectId(req.params.id) });
  res.send('Deleted');
});

app.delete('/api/admin/posts/:id', async (req, res) => {
  const { password } = req.query;
  if (password !== config.ADMIN_PASSWORD) return res.status(401).send('Unauthorized');
  
  const { ObjectId } = require('mongodb');
  const db = await connectDB();
  await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) });
  res.send('Deleted');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});