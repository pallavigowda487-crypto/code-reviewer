import React from 'react';
import './ReviewScoreCard.css';

const ReviewScoreCard = ({ score }) => {
  // Determine color based on score
  let strokeColor = 'var(--success)';
  if (score < 50) strokeColor = 'var(--error)';
  else if (score < 80) strokeColor = 'var(--warning)';

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="score-card card fade-in">
      <h3>Overall Score</h3>
      <div className="score-circle-container">
        <svg className="score-circle" width="120" height="120" viewBox="0 0 100 100">
          <circle
            className="score-circle-bg"
            cx="50" cy="50" r={radius}
            strokeWidth="8"
          />
          <circle
            className="score-circle-progress"
            cx="50" cy="50" r={radius}
            strokeWidth="8"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="score-value" style={{ color: strokeColor }}>
          {score}
        </div>
      </div>
      <p className="score-text">
        {score >= 80 ? 'Excellent code!' : score >= 50 ? 'Needs some improvement.' : 'Critical issues found.'}
      </p>
    </div>
  );
};

export default ReviewScoreCard;
