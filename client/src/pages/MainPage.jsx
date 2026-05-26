import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import { Play, Copy, Trash2, Loader2 } from 'lucide-react';
import './MainPage.css';

const LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C',
  'C++',
  'Go'
];

const MainPage = () => {
  const [code, setCode] = useState('// Paste your code here\n');
  const [language, setLanguage] = useState('JavaScript');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleReview = async () => {
    if (!code || code.trim() === '' || code.trim() === '// Paste your code here') {
      setError('Please provide some code to review.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/review', {
        code,
        language
      });
      
      if (response.data.success) {
        // Save the result locally to show in dashboard, or pass via state
        navigate('/dashboard', { state: { reviewResult: response.data.review } });
      } else {
        setError(response.data.message || 'Failed to review code.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred during review.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCode = () => {
    setCode('');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    // Could add toast notification here
  };

  const theme = document.documentElement.getAttribute('data-theme') || 'light';

  return (
    <div className="main-page fade-in">
      <header className="page-header">
        <h1>Welcome to Automated Code Reviewer</h1>
        <p>Harness the power of AI to detect bugs, vulnerabilities, and optimize your code instantly.</p>
      </header>

      <div className="editor-section card">
        <div className="toolbar">
          <div className="lang-selector">
            <label htmlFor="language">Language:</label>
            <select 
              id="language" 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="select-input"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          
          <div className="toolbar-actions">
            <button className="btn btn-secondary" onClick={copyCode} title="Copy Code">
              <Copy size={16} /> Copy
            </button>
            <button className="btn btn-secondary" onClick={clearCode} title="Clear Code">
              <Trash2 size={16} /> Clear
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleReview} 
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={18} className="spinner" /> : <Play size={18} />}
              {isLoading ? 'Reviewing...' : 'Review Code'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <CodeEditor 
          code={code} 
          setCode={setCode} 
          language={language}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default MainPage;
