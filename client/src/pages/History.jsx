import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, ExternalLink, Loader2 } from 'lucide-react';
import './History.css';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/reviews');
      if (response.data.success) {
        setReviews(response.data.reviews);
      } else {
        setError('Failed to fetch reviews.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/review/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const viewReview = (review) => {
    navigate('/dashboard', { state: { reviewResult: review } });
  };

  if (loading) {
    return (
      <div className="history-page loading-state fade-in">
        <Loader2 className="spinner" size={40} />
        <p>Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="history-page fade-in">
      <div className="page-header-small">
        <h2>Review History</h2>
        <p>Access and manage your past code reviews.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {reviews.length === 0 && !error ? (
        <div className="card empty-card">
          <p>You don't have any review history yet.</p>
        </div>
      ) : (
        <div className="history-list">
          {reviews.map((review) => (
            <div key={review._id} className="card history-card">
              <div className="history-card-header">
                <div className="history-meta">
                  <span className="history-lang">{review.language}</span>
                  <span className="history-date">
                    {new Date(review.createdAt).toLocaleDateString()} {new Date(review.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="history-score">Score: <strong>{review.score}</strong></div>
              </div>
              


              <div className="history-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => viewReview(review)}>
                  <ExternalLink size={14} /> View Full Report
                </button>
                <button className="btn btn-secondary btn-sm btn-danger" onClick={() => deleteReview(review._id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
