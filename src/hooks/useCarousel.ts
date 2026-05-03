import { useState, useCallback } from 'react';
import { FormAnswers } from '../types';

export function useCarousel(totalQuestions: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<FormAnswers>({});

  const canProceed = useCallback((questionName: string): boolean => {
    return answers[questionName] !== undefined;
  }, [answers]);

  const next = useCallback((questionName: string) => {
    if (canProceed(questionName) && currentSlide < totalQuestions - 1) {
      setCurrentSlide(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [canProceed, currentSlide, totalQuestions]);

  const previous = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const setAnswer = useCallback((questionName: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionName]: value
    }));
  }, []);

  const reset = useCallback(() => {
    setCurrentSlide(0);
    setAnswers({});
  }, []);

  const progress = ((currentSlide + 1) / totalQuestions) * 100;

  return {
    currentSlide,
    answers,
    progress,
    canProceed,
    next,
    previous,
    setAnswer,
    reset,
    isFirst: currentSlide === 0,
    isLast: currentSlide === totalQuestions - 1,
  };
}
