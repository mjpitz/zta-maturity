import './Navigation.css';

interface NavigationProps {
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function Navigation({ isFirst, isLast, canProceed, onPrevious, onNext, onSubmit }: NavigationProps) {
  const handleNext = () => {
    if (!canProceed) {
      alert('Please answer the current question before proceeding.');
      return;
    }
    onNext();
  };

  return (
    <div className="navigation-container">
      <button
        type="button"
        className="nav-btn prev-btn"
        onClick={onPrevious}
        style={{ visibility: isFirst ? 'hidden' : 'visible' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        <span>Previous</span>
      </button>

      {!isLast && (
        <button
          type="button"
          className="nav-btn next-btn"
          onClick={handleNext}
        >
          <span>Next</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}

      {isLast && (
        <button
          type="button"
          className="nav-btn submit-btn"
          onClick={onSubmit}
        >
          <span>Calculate Maturity Assessment</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}
