import { useState } from 'react';
import SearchPage from './components/SearchPage';
import FinancialDashboard from './components/FinancialDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState('search');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setCurrentPage('dashboard');
  };

  const handleBackToSearch = () => {
    setCurrentPage('search');
    setSelectedCompany(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentPage === 'search' ? (
        <SearchPage onSelectCompany={handleCompanySelect} />
      ) : (
        <FinancialDashboard 
          company={selectedCompany} 
          onBack={handleBackToSearch}
        />
      )}
    </div>
  );
}
