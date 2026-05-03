import { useState } from 'react';
import { PillarResult, FormAnswers } from '../types';
import { maturityModel, MATURITY_LABELS } from '../data/maturityModel';
import { generateShareUrl } from '../utils/wireFormat';
import './DetailedResults.css';

interface DetailedResultsProps {
  results: PillarResult[];
  answers: FormAnswers;
  onTakeAssessment: () => void;
  onEditQuestion?: (questionKey: string) => void;
  isSharedView?: boolean;
}

export function DetailedResults({ results, answers, onTakeAssessment, onEditQuestion, isSharedView = false }: DetailedResultsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    const shareUrl = generateShareUrl(answers);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert(`Share this URL:\n${shareUrl}`);
    }
  };

  return (
    <div className="detailed-results-container">
      <div className="detailed-results-header">
        <h2>Zero Trust Maturity Assessment - Detailed Results</h2>
        <p>Comprehensive breakdown of maturity levels across all pillars and capabilities</p>
      </div>

      {/* Action Buttons at Top */}
      <div className="detailed-results-actions">
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
        <button onClick={onTakeAssessment} className="take-assessment-btn">
          {isSharedView ? 'Take Your Own Assessment' : 'Take Assessment Again'}
        </button>
      </div>

      {/* Summary Section */}
      <div className="results-summary">
        <h3>Maturity Summary</h3>
        <div className="summary-grid">
          {results.map((result) => (
            <div key={result.pillar} className={`summary-card ${result.level.toLowerCase()}`}>
              <div className="summary-pillar">{result.pillar}</div>
              <div className={`summary-level ${result.level.toLowerCase()}`}>
                {result.level}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-breakdown">
        <h3>Detailed Breakdown by Pillar</h3>
        {Object.keys(maturityModel).map((pillar) => {
          const pillarResult = results.find((r) => r.pillar === pillar);
          return (
            <div key={pillar} className="pillar-section">
              <div className="pillar-header">
                <h4>{pillar}</h4>
                {pillarResult && (
                  <span className={`pillar-badge ${pillarResult.level.toLowerCase()}`}>
                    {pillarResult.level}
                  </span>
                )}
              </div>
              
              <div className="capabilities-list">
                {Object.keys(maturityModel[pillar]).map((capability) => {
                  const questionKey = `${pillar}:${capability}`;
                  const answerIndex = answers[questionKey] ?? 0;
                  const selectedOption = maturityModel[pillar][capability][answerIndex];
                  const level = MATURITY_LABELS[answerIndex];
                  
                  const isEditable = onEditQuestion && !isSharedView;
                  const handleClick = () => {
                    if (isEditable) {
                      onEditQuestion(questionKey);
                    }
                  };
                  
                  const handleKeyPress = (e: React.KeyboardEvent) => {
                    if (isEditable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onEditQuestion(questionKey);
                    }
                  };
                  
                  return (
                    <div 
                      key={capability} 
                      className={`capability-item ${isEditable ? 'editable' : ''}`}
                      onClick={handleClick}
                      onKeyPress={handleKeyPress}
                      role={isEditable ? 'button' : undefined}
                      tabIndex={isEditable ? 0 : undefined}
                      aria-label={isEditable ? `Edit answer for ${capability}` : undefined}
                    >
                      <div className="capability-header">
                        <h5>{capability}</h5>
                        <div className="capability-header-right">
                          <span className={`capability-level ${level.toLowerCase()}`}>
                            {level}
                          </span>
                          {onEditQuestion && !isSharedView && (
                            <svg className="edit-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12.75 2.25L15.75 5.25M1.5 16.5H4.5L14.625 6.375L11.625 3.375L1.5 13.5V16.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="capability-description">
                        {selectedOption}
                      </div>
                      {onEditQuestion && !isSharedView && (
                        <div className="edit-hint">Click to change answer</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
