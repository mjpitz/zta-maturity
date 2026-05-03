import { useCallback } from 'react';
import { FormAnswers } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface CarouselState {
  currentSlide: number;
  answers: FormAnswers;
}

const STORAGE_KEY = 'zta-assessment-state';
const INITIAL_STATE: CarouselState = {
  currentSlide: 0,
  answers: {},
};

export function useCarousel(totalQuestions: number) {
  const [state, setState] = useLocalStorage<CarouselState>(STORAGE_KEY, INITIAL_STATE);
  
  const { currentSlide, answers } = state;

  const canProceed = useCallback((questionName: string): boolean => {
    return answers[questionName] !== undefined;
  }, [answers]);

  const next = useCallback((questionName: string) => {
    if (canProceed(questionName) && currentSlide < totalQuestions - 1) {
      setState(prev => ({
        ...prev,
        currentSlide: prev.currentSlide + 1,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [canProceed, currentSlide, totalQuestions, setState]);

  const previous = useCallback(() => {
    if (currentSlide > 0) {
      setState(prev => ({
        ...prev,
        currentSlide: prev.currentSlide - 1,
      }));
    }
  }, [currentSlide, setState]);

  const setAnswer = useCallback((questionName: string, value: number) => {
    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionName]: value,
      },
    }));
  }, [setState]);

  const setAnswers = useCallback((newAnswers: FormAnswers) => {
    setState(prev => ({
      ...prev,
      answers: newAnswers,
    }));
  }, [setState]);

  const goToSlide = useCallback((slideIndex: number) => {
    if (slideIndex >= 0 && slideIndex < totalQuestions) {
      setState(prev => ({
        ...prev,
        currentSlide: slideIndex,
      }));
    }
  }, [totalQuestions, setState]);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, [setState]);

  const progress = ((currentSlide + 1) / totalQuestions) * 100;

  return {
    currentSlide,
    answers,
    progress,
    canProceed,
    next,
    previous,
    setAnswer,
    setAnswers,
    goToSlide,
    reset,
    isFirst: currentSlide === 0,
    isLast: currentSlide === totalQuestions - 1,
  };
}
