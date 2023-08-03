const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet=require("helmet");

const app = express();
const PORT = 5000;

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin"}));
app.use(cors());

//MongoDB setup
mongoose.connect('mongodb://127.0.0.1:27017/rasu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect('mongodb://127.0.0.1:27017/rasu').then(()=>{
//     console.log("connected");
// }).catch(()=>{
//     console.log("not conneted");
// });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Schema
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});


app.put('/api/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Bad request' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
