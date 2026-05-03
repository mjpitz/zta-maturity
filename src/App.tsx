import { useState, useMemo, useEffect } from 'react';
import { Question } from './components/Question';
import { ProgressBar } from './components/ProgressBar';
import { Navigation } from './components/Navigation';
import { Results } from './components/Results';
import { useCarousel } from './hooks/useCarousel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { maturityModel, MATURITY_LABELS } from './data/maturityModel';
import { QuestionData, PillarResult } from './types';
import './App.css';

interface AssessmentResults {
  showResults: boolean;
  results: PillarResult[];
}

const RESULTS_STORAGE_KEY = 'zta-assessment-results';

function App() {
  const [savedResults, setSavedResults] = useLocalStorage<AssessmentResults | null>(
    RESULTS_STORAGE_KEY,
    null
  );
  const [showResults, setShowResults] = useState(savedResults?.showResults || false);
  const [results, setResults] = useState<PillarResult[]>(savedResults?.results || []);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);

  // Generate questions array
  const questions = useMemo(() => {
    const questionsArray: QuestionData[] = [];
    for (const pillar in maturityModel) {
      for (const fn in maturityModel[pillar]) {
        questionsArray.push({
          pillar,
          fn,
          options: maturityModel[pillar][fn],
        });
      }
    }
    return questionsArray;
  }, []);

  const carousel = useCarousel(questions.length);
  const currentQuestion = questions[carousel.currentSlide];
  const questionName = `${currentQuestion.pillar}:${currentQuestion.fn}`;

  // Show notice if progress was restored from local storage
  useEffect(() => {
    const hasAnswers = Object.keys(carousel.answers).length > 0;
    const isNotFirstSlide = carousel.currentSlide > 0;
    
    if (hasAnswers || isNotFirstSlide) {
      setShowRestoredNotice(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowRestoredNotice(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (showResults && results.length > 0) {
      setSavedResults({ showResults, results });
    }
  }, [showResults, results, setSavedResults]);

  const handleSubmit = () => {
    // Calculate results
    const sections: { [key: string]: number[] } = {};

    for (const name in carousel.answers) {
      const parts = name.split(':');
      const pillar = parts[0];
      const score = carousel.answers[name];

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
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    carousel.reset();
    setSavedResults(null); // Clear saved results from localStorage
    setShowResults(false);
    setResults([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showResults) {
    return (
      <div className="container">
        <Results results={results} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Zero Trust Maturity Model Assessment</h1>
        <p className="subtitle">
          Evaluate your organization's Zero Trust Architecture maturity across five key pillars
        </p>
      </header>

      {showRestoredNotice && (
        <div className="restored-notice">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 6V10L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Your progress has been restored. Continue where you left off!</span>
          <button 
            className="close-notice" 
            onClick={() => setShowRestoredNotice(false)}
            aria-label="Close notice"
          >
            ×
          </button>
        </div>
      )}

      <ProgressBar
        current={carousel.currentSlide + 1}
        total={questions.length}
        progress={carousel.progress}
      />

      <div className="carousel-container">
        <Question
          {...currentQuestion}
          name={questionName}
          value={carousel.answers[questionName]}
          onChange={(value) => carousel.setAnswer(questionName, value)}
        />
      </div>

      <Navigation
        isFirst={carousel.isFirst}
        isLast={carousel.isLast}
        canProceed={carousel.canProceed(questionName)}
        onPrevious={carousel.previous}
        onNext={() => carousel.next(questionName)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
