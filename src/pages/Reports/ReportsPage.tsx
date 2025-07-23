import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ReportsList } from '../../features/reports/components/ReportsList';
import { ReportDetails } from '../../features/reports/components/ReportDetails';
import { CourtReport, CourtReportStatus } from '../../features/staffReport/types';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourtReports } from '../../api/facility/facilityApi';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<CourtReport | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { reportId } = useParams<{ reportId?: string }>();
  const navigate = useNavigate();

  // Fetch report by ID if provided in URL
  useEffect(() => {
    const fetchReportById = async () => {
      if (!reportId) return;
      
      setIsLoading(true);
      try {
        const response = await getCourtReports();
        const foundReport = response.reports.find(report => report.courtReportId === reportId);
        
        if (foundReport) {
          setSelectedReport(foundReport);
        } else {
          console.error(`Report with ID ${reportId} not found`);
          navigate('/reports');
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReportById();
  }, [reportId, navigate]);

  const handleSelectReport = (report: CourtReport) => {
    setSelectedReport(report);
    navigate(`/reports/${report.courtReportId}`);
  };

  const handleReportUpdated = () => {
    // Trigger a refresh of the reports list when going back
    setRefreshKey(prev => prev + 1);
    
    // Wait a moment before going back to the list to show success message
    setTimeout(() => {
      setSelectedReport(null);
      navigate('/reports');
    }, 2000);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    navigate('/reports');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-500"></div>
          </div>
        ) : selectedReport ? (
          <div>
            <button 
              onClick={handleBackToList}
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