const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Load or initialize data
let scores = {};
let history = [];

try {
  scores = JSON.parse(fs.readFileSync('./scores.json'));
} catch (e) {
  console.log("No scores.json found, initializing...");
  scores = {};
}

try {
  history = JSON.parse(fs.readFileSync('./history.json'));
} catch (e) {
  console.log("No history.json found, initializing...");
  history = [];
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/main.html'));
});

app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/add.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view.html'));
});

app.get('/history', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/history.html'));
});

// Dynamic page: Team-specific score view
app.get('/score/:team', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/team.html'));
});

// API: Get scores
app.get('/api/scores', (req, res) => {
  res.json(scores);
});

// API: Add score
app.post('/api/scores', (req, res) => {
  const { team, points } = req.body;

  if (!team || typeof points !== 'number') {
    return res.status(400).json({ error: 'Invalid team or points' });
  }

  scores[team] = (scores[team] || 0) + points;

  const log = {
    team,
    points,
    time: new Date().toISOString()
  };
  history.unshift(log);
  history = history.slice(0, 100); // keep most recent 100

  fs.writeFileSync('./scores.json', JSON.stringify(scores, null, 2));
  fs.writeFileSync('./history.json', JSON.stringify(history, null, 2));

  res.json({ success: true });
});

// API: Reset scores
app.post('/api/reset', (req, res) => {
  for (const team in scores) scores[team] = 0;
  history = [];

  fs.writeFileSync('./scores.json', JSON.stringify(scores, null, 2));
  fs.writeFileSync('./history.json', JSON.stringify(history, null, 2));

  res.json({ success: true });
});

// API: Get score history
app.get('/api/history', (req, res) => {
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
app.post('/api/reset-history', (req, res) => {
  history = [];
  fs.writeFileSync('./history.json', JSON.stringify(history, null, 2));
  res.json({ success: true });
});
