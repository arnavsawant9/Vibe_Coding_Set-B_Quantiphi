import { useState, useEffect } from 'react';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    cost: '',
    billingCycle: 'Monthly',
    nextRenewalDate: ''
  });

  // Fetch subscriptions from backend
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serviceName || !formData.cost || !formData.nextRenewalDate) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceName: formData.serviceName,
          cost: parseFloat(formData.cost),
          billingCycle: formData.billingCycle,
          nextRenewalDate: formData.nextRenewalDate,
          isActive: true
        })
      });

      if (response.ok) {
        // Reset form
        setFormData({
          serviceName: '',
          cost: '',
          billingCycle: 'Monthly',
          nextRenewalDate: ''
        });
        // Refresh subscription list
        await fetchSubscriptions();
      } else {
        alert('Failed to add subscription');
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      alert('Error adding subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Subscription Manager
          </h1>
          <p className="text-indigo-100 text-lg">Track and manage all your subscriptions in one place</p>
        </div>

        {/* Subscription Entry Form */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Subscription</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <label htmlFor="serviceName" className="text-sm font-semibold text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                placeholder="e.g., Netflix"
                required
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="cost" className="text-sm font-semibold text-gray-700 mb-2">
                Cost ($) *
              </label>
              <input
                type="number"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="billingCycle" className="text-sm font-semibold text-gray-700 mb-2">
                Billing Cycle
              </label>
              <select
                id="billingCycle"
                name="billingCycle"
                value={formData.billingCycle}
                onChange={handleInputChange}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition bg-white"
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="nextRenewalDate" className="text-sm font-semibold text-gray-700 mb-2">
                Next Renewal Date *
              </label>
              <input
                type="date"
                id="nextRenewalDate"
                name="nextRenewalDate"
                value={formData.nextRenewalDate}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            <button
              type="submit"
              className="col-span-full sm:col-span-1 lg:col-span-1 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg active:translate-y-0"
            >
              Add Subscription
            </button>
          </form>
        </div>

        {/* Subscriptions List */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Subscriptions</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading subscriptions...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No subscriptions yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map(subscription => (
                <div
                  key={subscription.id}
                  className={`rounded-lg border-l-4 p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 ${
                    subscription.isActive
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500'
                      : 'bg-gray-100 border-gray-400 opacity-75'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4 pb-4 border-b-2 border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">{subscription.serviceName}</h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        subscription.isActive ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      {subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong className="text-gray-900">Cost:</strong> ${subscription.cost.toFixed(2)}{' '}
                      <span className="text-gray-500">({subscription.billingCycle})</span>
                    </p>
                    <p>
                      <strong className="text-gray-900">Monthly Cost:</strong> ${subscription.monthlyCost.toFixed(2)}
                    </p>
                    <p>
                      <strong className="text-gray-900">Next Renewal:</strong> {subscription.nextRenewalDate}
                    </p>
                    <p>
                      <strong className="text-gray-900">Days Until Renewal:</strong> {subscription.daysUntilRenewal}
                    </p>
                    {subscription.renewingSoon && (
                      <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 font-semibold text-center">
                        ⚠️ Renewing Soon!
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
