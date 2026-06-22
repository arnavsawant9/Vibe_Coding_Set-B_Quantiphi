import { useState, useEffect } from 'react';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalMonthlyBurn: 0,
    upcomingRenewalsCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    cost: '',
    billingCycle: 'Monthly',
    nextRenewalDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // Fetch metrics from backend
  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      const response = await fetch('http://localhost:5000/api/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  // Load subscriptions and metrics on component mount
  useEffect(() => {
    fetchSubscriptions();
    fetchMetrics();
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
    setFormErrors({});
    setSubmitSuccess(false);

    // Validation
    const errors = {};
    
    if (!formData.serviceName || formData.serviceName.trim() === '') {
      errors.serviceName = 'Service name is required';
    }
    
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      errors.cost = 'Cost must be greater than 0';
    }
    
    if (!formData.nextRenewalDate) {
      errors.nextRenewalDate = 'Renewal date is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceName: formData.serviceName.trim(),
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
        setSubmitSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
        // Refresh subscription list and metrics
        await fetchSubscriptions();
        await fetchMetrics();
      } else {
        setFormErrors({ submit: 'Failed to add subscription' });
      }
    } catch (error) {
      console.error('Error adding subscription:', error);
      setFormErrors({ submit: 'Error adding subscription. Please try again.' });
    }
  };

  // Handle subscription toggle (Active/Paused)
  const handleToggleSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/subscriptions/${subscriptionId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh both subscriptions and metrics to update burn rate live
        await fetchSubscriptions();
        await fetchMetrics();
      } else {
        alert('Failed to toggle subscription');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      alert('Error toggling subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Subscription Manager
          </h1>
          <p className="text-indigo-100 text-lg">Track and manage all your subscriptions in one place</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Monthly Burn Rate Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                  Total Monthly Burn Rate
                </p>
                {metricsLoading ? (
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    ${metrics.totalMonthlyBurn.toFixed(2)}
                  </p>
                )}
              </div>
              <div className="text-4xl sm:text-5xl ml-4">💰</div>
            </div>
          </div>

          {/* Upcoming Renewals Alert Count Card */}
          <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                  Upcoming Renewals Alert Count
                </p>
                {metricsLoading ? (
                  <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                    {metrics.upcomingRenewalsCount}
                  </p>
                )}
              </div>
              <div className="text-4xl sm:text-5xl ml-4">🔔</div>
            </div>
          </div>
        </div>

        {/* Subscription Entry Form */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-2xl font-bold text-black-800 mb-6">Add New Subscription</h2>
          
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-medium">
              ✓ Subscription added successfully!
            </div>
          )}
          
          {formErrors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-medium">
              ✕ {formErrors.submit}
            </div>
          )}
          
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
                className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  formErrors.serviceName
                    ? 'border-red-300 focus:border-red-600 focus:ring-red-200'
                    : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-200'
                }`}
              />
              {formErrors.serviceName && (
                <p className="text-red-600 text-xs mt-1">{formErrors.serviceName}</p>
              )}
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
                className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  formErrors.cost
                    ? 'border-red-300 focus:border-red-600 focus:ring-red-200'
                    : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-200'
                }`}
              />
              {formErrors.cost && (
                <p className="text-red-600 text-xs mt-1">{formErrors.cost}</p>
              )}
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
                className={`px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  formErrors.nextRenewalDate
                    ? 'border-red-300 focus:border-red-600 focus:ring-red-200'
                    : 'border-gray-300 focus:border-indigo-600 focus:ring-indigo-200'
                }`}
              />
              {formErrors.nextRenewalDate && (
                <p className="text-red-600 text-xs mt-1">{formErrors.nextRenewalDate}</p>
              )}
            </div>

            <button
              type="submit"
              className="col-span-full sm:col-span-1 lg:col-span-1 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition transform hover:-translate-y-0.5 shadow-lg active:translate-y-0"
            >
              Add Subscription
            </button>
          </form>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Subscriptions</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-600 text-lg font-medium mb-2">No subscriptions yet</p>
              <p className="text-gray-500 text-sm">Add your first subscription using the form above to get started tracking your expenses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-bold text-gray-700">Service</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-bold text-gray-700">Cost</th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-bold text-gray-700">Cycle</th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-bold text-gray-700">Renewal</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription, index) => (
                    <tr
                      key={subscription.id}
                      className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } ${!subscription.isActive ? 'opacity-60' : ''}`}
                    >
                      <td className={`px-4 sm:px-6 py-4 text-sm font-semibold ${subscription.isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                        {subscription.serviceName}
                      </td>
                      <td className={`px-4 sm:px-6 py-4 text-sm ${subscription.isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                        ${subscription.cost.toFixed(2)}
                      </td>
                      <td className={`hidden sm:table-cell px-6 py-4 text-sm ${subscription.isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                        {subscription.billingCycle}
                      </td>
                      <td className={`hidden md:table-cell px-6 py-4 text-sm ${subscription.isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                        {subscription.nextRenewalDate}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                          <button
                            onClick={() => handleToggleSubscription(subscription.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                              subscription.isActive
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-400 text-white hover:bg-gray-500'
                            }`}
                          >
                            {subscription.isActive ? 'Active' : 'Paused'}
                          </button>
                          {subscription.renewingSoon && (
                            <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 whitespace-nowrap">
                              Renewing Soon
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
