import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Loader2, Activity, Code2, AlertTriangle, FileCheck } from 'lucide-react';
import './Analytics.css';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899'];
const SEVERITY_COLORS = {
  'High': '#ef4444',
  'Medium': '#f59e0b',
  'Low': '#10b981'
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics');
      if (response.data.success) {
        setData(response.data.analytics);
      } else {
        setError('Failed to load analytics.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page loading-state fade-in">
        <Loader2 className="spinner" size={40} />
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message fade-in">{error}</div>;
  }

  if (!data || data.totalReviews === 0) {
    return (
      <div className="analytics-page fade-in">
        <div className="page-header-small">
          <h2>Analytics Dashboard</h2>
        </div>
        <div className="card empty-card">
          <p>No analytics data available yet. Start reviewing some code!</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const langData = Object.entries(data.languageUsage || {}).map(([name, value]) => ({ name, value }));
  const issueData = Object.entries(data.issueDistribution || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="analytics-page fade-in">
      <div className="page-header-small">
        <h2>Analytics Dashboard</h2>
        <p>Insights and statistics from your code reviews.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon-wrapper blue">
            <FileCheck size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{data.totalReviews}</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper green">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{data.averageScore}</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper purple">
            <Code2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Languages Used</span>
            <span className="stat-value">{Object.keys(data.languageUsage || {}).length}</span>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon-wrapper orange">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Issues Found</span>
            <span className="stat-value">
              {Object.values(data.issueDistribution || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card card">
          <h3>Language Usage</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={langData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {langData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card card">
          <h3>Issue Distribution by Severity</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {issueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name] || COLORS[0]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
