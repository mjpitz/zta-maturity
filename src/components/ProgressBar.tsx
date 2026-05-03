import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
}

export function ProgressBar({ current, total, progress }: ProgressBarProps) {
  return (
    <>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">
        <span>Question {current} of {total}</span>
      </div>
    </>
  );
}
