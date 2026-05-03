import { QuestionData } from '../types';
import './Question.css';

interface QuestionProps extends QuestionData {
  name: string;
  value?: number;
  onChange: (value: number) => void;
}

export function Question({ pillar, fn, options, name, value, onChange }: QuestionProps) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="pillar-badge">{pillar}</span>
        <h3 className="question-title">{fn}</h3>
      </div>

      <div className="options-container">
        {options.map((text, index) => {
          const id = `${name}:${index}`;
          
          return (
            <div key={id} className="option-item">
              <input
                type="radio"
                id={id}
                name={name}
                value={index}
                checked={value === index}
                onChange={() => onChange(index)}
                required
              />
              <label htmlFor={id}>
                <span className="option-text">{text}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
