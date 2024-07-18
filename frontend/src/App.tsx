import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import ApiConnexion from './Component/ApiConnexion';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<ApiConnexion />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
