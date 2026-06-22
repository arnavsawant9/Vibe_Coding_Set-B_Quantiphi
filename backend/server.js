const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data store
const subscriptions = [
  {
    id: 1,
    serviceName: 'Netflix',
    cost: 15.99,
    billingCycle: 'monthly',
    nextRenewalDate: '2026-07-22',
    isActive: true
  },
  {
    id: 2,
    serviceName: 'Spotify',
    cost: 10.99,
    billingCycle: 'monthly',
    nextRenewalDate: '2026-07-15',
    isActive: true
  },
  {
    id: 3,
    serviceName: 'Adobe Creative Cloud',
    cost: 54.99,
    billingCycle: 'monthly',
    nextRenewalDate: '2026-08-01',
    isActive: false
  }
];

// Routes
app.get('/subscriptions', (req, res) => {
  res.json(subscriptions);
});

app.get('/subscriptions/:id', (req, res) => {
  const subscription = subscriptions.find(s => s.id === parseInt(req.params.id));
  if (subscription) {
    res.json(subscription);
  } else {
    res.status(404).json({ message: 'Subscription not found' });
  }
});

app.post('/subscriptions', (req, res) => {
  const { serviceName, cost, billingCycle, nextRenewalDate, isActive } = req.body;
  
  if (!serviceName || cost === undefined) {
    return res.status(400).json({ message: 'serviceName and cost are required' });
  }

  const newSubscription = {
    id: subscriptions.length > 0 ? Math.max(...subscriptions.map(s => s.id)) + 1 : 1,
    serviceName,
    cost,
    billingCycle: billingCycle || 'monthly',
    nextRenewalDate: nextRenewalDate || new Date().toISOString().split('T')[0],
    isActive: isActive !== undefined ? isActive : true
  };

  subscriptions.push(newSubscription);
  res.status(201).json(newSubscription);
});

app.put('/subscriptions/:id', (req, res) => {
  const subscription = subscriptions.find(s => s.id === parseInt(req.params.id));
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  const { serviceName, cost, billingCycle, nextRenewalDate, isActive } = req.body;
  
  if (serviceName !== undefined) subscription.serviceName = serviceName;
  if (cost !== undefined) subscription.cost = cost;
  if (billingCycle !== undefined) subscription.billingCycle = billingCycle;
  if (nextRenewalDate !== undefined) subscription.nextRenewalDate = nextRenewalDate;
  if (isActive !== undefined) subscription.isActive = isActive;

  res.json(subscription);
});

app.delete('/subscriptions/:id', (req, res) => {
  const index = subscriptions.findIndex(s => s.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  const deletedSubscription = subscriptions.splice(index, 1);
  res.json(deletedSubscription[0]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS enabled for all origins`);
});
