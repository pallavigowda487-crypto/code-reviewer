import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './IssuesCard.css';

const IssueItem = ({ issue }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return <AlertCircle className="severity-icon high" size={20} />;
      case 'medium': return <AlertTriangle className="severity-icon medium" size={20} />;
      default: return <Info className="severity-icon low" size={20} />;
    }
  };

  const severityClass = `issue-severity-${issue.severity?.toLowerCase() || 'low'}`;

  return (
    <div className={`issue-item ${severityClass}`}>
      <div className="issue-header" onClick={() => setExpanded(!expanded)}>
        <div className="issue-title-group">
          {getSeverityIcon(issue.severity)}
          <span className="issue-line">Line {issue.line}:</span>
          <span className="issue-problem">{issue.problem}</span>
        </div>
        <button className="expand-btn">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="issue-details">
          <div className="issue-solution">
            <strong>Suggested Solution:</strong>
            <p>{issue.solution}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const IssuesCard = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="card fade-in">
        <h3>Issues Detected</h3>
        <p className="no-issues">Great job! No major issues detected in your code.</p>
      </div>
    );
  }

  return (
    <div className="card fade-in issues-card">
      <h3>Issues Detected ({issues.length})</h3>
      <div className="issues-list">
        {issues.map((issue, index) => (
          <IssueItem key={index} issue={issue} />
        ))}
      </div>
    </div>
  );
};

export default IssuesCard;
