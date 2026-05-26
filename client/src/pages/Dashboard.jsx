import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewScoreCard from '../components/ReviewScoreCard';
import IssuesCard from '../components/IssuesCard';
import Editor from '@monaco-editor/react';
import { CheckCircle2, ArrowLeft, Download, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reviewResult = location.state?.reviewResult;

  if (!reviewResult) {
    return (
      <div className="dashboard empty-state">
        <h2>No Review Data Found</h2>
        <p>Please submit some code for review first.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Go to Review Page
        </button>
      </div>
    );
  }

  const { score, summary, reviewSummary, issues, improvedCode, bestPractices, fallback, fallbackReason } = reviewResult;
  const rawSummary = summary || reviewSummary || '';
  const isFallbackReview = fallback || /Grok API unavailable|Fallback review for/i.test(rawSummary);
  const displaySummary = isFallbackReview
    ? 'Live AI review unavailable. The app is showing a fallback review instead.'
    : rawSummary;

  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'light';

  const copyImprovedCode = () => {
    if (improvedCode) {
      navigator.clipboard.writeText(improvedCode);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('dashboard-content');
    if (!element) return;
    
    // Hide buttons for PDF
    const actions = document.querySelector('.dashboard-actions');
    if (actions) actions.style.display = 'none';

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Code_Review_Report.pdf');
    } catch (err) {
      console.error('Error generating PDF', err);
    } finally {
      if (actions) actions.style.display = 'flex';
    }
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Editor
        </button>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" onClick={downloadPDF}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div id="dashboard-content" className="dashboard-grid">
        <div className="grid-left">
          <ReviewScoreCard score={score || 0} />
          
          {(fallback || isFallbackReview) && (
            <div className="card warning-card">
              <h3>Fallback Review</h3>
              <p>
                Live AI review could not be completed. Showing a fallback review instead.
              </p>
              {fallbackReason && (
                <p className="fallback-reason">Reason: {fallbackReason}</p>
              )}
            </div>
          )}

          <div className="card best-practices-card">
            <h3>Best Practices Checklist</h3>
            <ul className="practices-list">
              {bestPractices && bestPractices.length > 0 ? (
                bestPractices.map((practice, index) => (
                  <li key={index} className="practice-item">
                    <CheckCircle2 className="practice-icon" size={18} />
                    <span>{practice}</span>
                  </li>
                ))
              ) : (
                <li className="practice-item text-muted">No specific best practices provided.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="grid-right">
          <IssuesCard issues={issues || []} />
          
          {improvedCode && (
            <div className="card improved-code-card">
              <div className="card-header-flex">
                <h3>Improved Code</h3>
                <button className="btn btn-secondary btn-sm" onClick={copyImprovedCode}>
                  <Copy size={14} /> Copy
                </button>
              </div>
              <div className="editor-container readonly-editor">
                <Editor
                  height="400px"
                  language="javascript" // Should dynamically receive language if passed
                  value={improvedCode}
                  theme={monacoTheme}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
