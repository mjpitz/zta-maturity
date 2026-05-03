import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailedResults } from '../components/DetailedResults';
import { decodeAnswers } from '../utils/wireFormat';
import { MATURITY_LABELS } from '../data/maturityModel';
import { PillarResult, FormAnswers } from '../types';

export function DetailsPage() {
  const { encoded } = useParams<{ encoded: string }>();
  const navigate = useNavigate();
  const [results, setResults] = useState<PillarResult[]>([]);
  const [answers, setAnswers] = useState<FormAnswers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!encoded) {
      setError('No encoded data provided');
      setIsLoading(false);
      return;
    }

    const decodedAnswers = decodeAnswers(encoded);
    if (!decodedAnswers) {
      setError('Invalid or corrupted assessment data');
      setIsLoading(false);
      return;
    }

    // Calculate results from decoded answers
    const sections: { [key: string]: number[] } = {};
    
    for (const name in decodedAnswers) {
      const parts = name.split(':');
      const pillar = parts[0];
      const score = decodedAnswers[name];
      
      if (!sections[pillar]) {
        sections[pillar] = [];
      }
      sections[pillar].push(score);
    }
    
    const calculatedResults: PillarResult[] = [];
    for (const pillar in sections) {
      const scores = sections[pillar].sort((a, b) => a - b);
      const medianIdx = Math.floor(scores.length / 2);
      const median = scores[medianIdx];
      const level = MATURITY_LABELS[median];
      
      calculatedResults.push({
        pillar,
        level,
        levelIndex: median,
      });
    }
    
    setResults(calculatedResults);
    setAnswers(decodedAnswers);
    setIsLoading(false);
  }, [encoded]);

  const handleTakeAssessment = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading assessment results...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Error Loading Results</h2>
          <p>{error}</p>
          <button onClick={handleTakeAssessment} style={{ marginTop: '1rem' }}>
            Take Your Own Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <DetailedResults 
        results={results} 
        answers={answers} 
        onTakeAssessment={handleTakeAssessment}
        isSharedView={true}
      />
    </div>
  );
}
