import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ReportsList } from '../../features/reports/components/ReportsList';
import { ReportDetails } from '../../features/reports/components/ReportDetails';
import { CourtReport, CourtReportStatus } from '../../features/staffReport/types';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<CourtReport | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectReport = (report: CourtReport) => {
    setSelectedReport(report);
  };

  const handleReportUpdated = () => {
    // Trigger a refresh of the reports list when going back
    setRefreshKey(prev => prev + 1);
    
    // Wait a moment before going back to the list to show success message
    setTimeout(() => {
      setSelectedReport(null);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {selectedReport ? (
          <div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="mb-4 text-mint-400 hover:text-mint-500 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Reports List
            </button>
            <ReportDetails 
              report={selectedReport} 
              onReportUpdated={handleReportUpdated}
            />
          </div>
        ) : (
          <ReportsList 
            onSelectReport={handleSelectReport}
            key={refreshKey} // Force re-render when refreshKey changes
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage; 