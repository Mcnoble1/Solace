import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SymptomChecker from './pages/SymptomChecker';
import PeriodTracker from './pages/PeriodTracker';
import MentalHealth from './pages/MentalHealth';
import Resources from './pages/Resources';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import HealthcareFacilities from './pages/HealthcareFacilities';
import Community from './pages/Community';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/symptom-checker" element={<SymptomChecker />} />
            <Route path="/period-tracker" element={<PeriodTracker />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route
              path="/healthcare-facilities"
              element={<HealthcareFacilities />}
            />
            <Route path="/community" element={<Community />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
