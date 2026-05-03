import { Routes, Route } from 'react-router-dom';
import { AssessmentPage } from './pages/AssessmentPage';
import { DetailsPage } from './pages/DetailsPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AssessmentPage />} />
      <Route path="/details/:encoded" element={<DetailsPage />} />
    </Routes>
  );
}

export default App;
