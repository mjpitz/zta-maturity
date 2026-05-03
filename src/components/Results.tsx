import { PillarResult } from '../types';
import './Results.css';

interface ResultsProps {
  results: PillarResult[];
  onRestart: () => void;
}

export function Results({ results, onRestart }: ResultsProps) {
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
        <button onClick={onRestart} className="restart-btn">
          Take Assessment Again
        </button>
      </div>
    </div>
  );
}
