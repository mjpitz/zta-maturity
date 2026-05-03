import { useState, useMemo } from 'react';
import { Question } from './components/Question';
import { ProgressBar } from './components/ProgressBar';
import { Navigation } from './components/Navigation';
import { Results } from './components/Results';
import { useCarousel } from './hooks/useCarousel';
import { maturityModel, MATURITY_LABELS } from './data/maturityModel';
import { QuestionData, PillarResult } from './types';
import './App.css';

function App() {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<PillarResult[]>([]);

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
