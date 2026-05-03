import { useState } from 'react';
import { PillarResult, FormAnswers } from '../types';
import { generateShareUrl } from '../utils/wireFormat';
import './Results.css';

interface ResultsProps {
  results: PillarResult[];
  answers: FormAnswers;
  onRestart: () => void;
}

export function Results({ results, answers, onRestart }: ResultsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const shareUrl = generateShareUrl(answers);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // Fallback: show the URL in an alert
      alert(`Share this URL:\n${shareUrl}`);
    }
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Your Maturity Assessment Results</h2>
        <p>Based on your responses, here's your organization's maturity level across each pillar:</p>
      </div>
      
      <div className="results-grid">
        {results.map((result) => (
          <div key={result.pillar} className={`result-card ${result.level.toLowerCase()}`}>
            <div className="result-pillar">{result.pillar}</div>
            <div className={`result-level ${result.level.toLowerCase()}`}>
              {result.level}
            </div>
          </div>
        ))}
      </div>
      
      <div className="results-footer">
        <button onClick={handleShare} className="share-btn">
          {copySuccess ? (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Link Copied!
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5.5L13.5 2L10 5.5ZM13.5 2V5.5V2ZM13.5 2H10H13.5Z" fill="currentColor"/>
                <path d="M10 5.5L13.5 2M13.5 2V5.5M13.5 2H10M7.5 3.5H3.5C2.94772 3.5 2.5 3.94772 2.5 4.5V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H11.5C12.0523 13.5 12.5 13.0523 12.5 12.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share Results
            </>
          )}
        </button>
        <button onClick={onRestart} className="restart-btn">
          Take Assessment Again
        </button>
      </div>
    </div>
  );
}
