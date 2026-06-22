const express = require('express');
const cors = require('cors');
const { normalizeToMonthly, daysUntilRenewal, isRenewingSoon } = require('./utils');

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
app.get('/api/subscriptions', (req, res) => {
  const enrichedSubscriptions = subscriptions.map(subscription => ({
    ...subscription,
    monthlyCost: normalizeToMonthly(subscription.cost, subscription.billingCycle),
    daysUntilRenewal: daysUntilRenewal(subscription.nextRenewalDate),
    renewingSoon: isRenewingSoon(daysUntilRenewal(subscription.nextRenewalDate))
  }));
  res.json(enrichedSubscriptions);
});

app.get('/api/subscriptions/:id', (req, res) => {
  const subscription = subscriptions.find(s => s.id === parseInt(req.params.id));
  if (subscription) {
    const enrichedSubscription = {
      ...subscription,
      monthlyCost: normalizeToMonthly(subscription.cost, subscription.billingCycle),
      daysUntilRenewal: daysUntilRenewal(subscription.nextRenewalDate),
      renewingSoon: isRenewingSoon(daysUntilRenewal(subscription.nextRenewalDate))
    };
    res.json(enrichedSubscription);
  } else {
    res.status(404).json({ message: 'Subscription not found' });
  }
});

app.post('/api/subscriptions', (req, res) => {
  const { serviceName, cost, billingCycle, nextRenewalDate, isActive } = req.body;
  
  if (!serviceName || cost === undefined) {
    return res.status(400).json({ message: 'serviceName and cost are required' });
  }

  const newSubscription = {
    id: subscriptions.length > 0 ? Math.max(...subscriptions.map(s => s.id)) + 1 : 1,
    serviceName,
    cost,
    billingCycle: billingCycle || 'Monthly',
    nextRenewalDate: nextRenewalDate || new Date().toISOString().split('T')[0],
    isActive: isActive !== undefined ? isActive : true
  };

  subscriptions.push(newSubscription);
  
  const enrichedSubscription = {
    ...newSubscription,
    monthlyCost: normalizeToMonthly(newSubscription.cost, newSubscription.billingCycle),
    daysUntilRenewal: daysUntilRenewal(newSubscription.nextRenewalDate),
    renewingSoon: isRenewingSoon(daysUntilRenewal(newSubscription.nextRenewalDate))
  };
  
  res.status(201).json(enrichedSubscription);
});

app.patch('/api/subscriptions/:id/toggle', (req, res) => {
  const subscription = subscriptions.find(s => s.id === parseInt(req.params.id));
  
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  subscription.isActive = !subscription.isActive;
  
  const enrichedSubscription = {
    ...subscription,
    monthlyCost: normalizeToMonthly(subscription.cost, subscription.billingCycle),
    daysUntilRenewal: daysUntilRenewal(subscription.nextRenewalDate),
    renewingSoon: isRenewingSoon(daysUntilRenewal(subscription.nextRenewalDate))
  };
  
  res.json(enrichedSubscription);
});

app.put('/api/subscriptions/:id', (req, res) => {
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

  const enrichedSubscription = {
    ...subscription,
    monthlyCost: normalizeToMonthly(subscription.cost, subscription.billingCycle),
    daysUntilRenewal: daysUntilRenewal(subscription.nextRenewalDate),
    renewingSoon: isRenewingSoon(daysUntilRenewal(subscription.nextRenewalDate))
  };
  
  res.json(enrichedSubscription);
});

app.delete('/api/subscriptions/:id', (req, res) => {
  const index = subscriptions.findIndex(s => s.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  const deletedSubscription = subscriptions.splice(index, 1)[0];
  
  const enrichedSubscription = {
    ...deletedSubscription,
    monthlyCost: normalizeToMonthly(deletedSubscription.cost, deletedSubscription.billingCycle),
    daysUntilRenewal: daysUntilRenewal(deletedSubscription.nextRenewalDate),
    renewingSoon: isRenewingSoon(daysUntilRenewal(deletedSubscription.nextRenewalDate))
  };
  
  res.json(enrichedSubscription);
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
