import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/badge';
import { getCourtReports } from '../../../api/facility/facilityApi';
import { CourtReport, CourtReportStatus } from '../../staffReport/types';
import { format } from 'date-fns';

interface ReportsListProps {
  onSelectReport?: (report: CourtReport) => void;
  key?: number; // Add key prop for refreshing
}

export const ReportsList: React.FC<ReportsListProps> = ({ onSelectReport }) => {
  const [reports, setReports] = useState<CourtReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const data = await getCourtReports();
        setReports(data.reports);
        setError(null);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
        console.error('Error fetching reports:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getStatusBadgeColor = (status: CourtReportStatus) => {
    switch (status) {
      case CourtReportStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CourtReportStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CourtReportStatus.COMPLETED:
        return 'bg-green-100 text-green-800 border-green-200';
      case CourtReportStatus.CANCELLED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 my-4">
        <p className="text-red-700 text-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }



  const displayReports = reports.length > 0 ? reports : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Court Reports</h1>
        <p className="text-slate-300">Manage and track maintenance reports for your courts</p>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {displayReports.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No Reports Found</h3>
            <p className="text-slate-400 text-lg">There are no maintenance reports for your courts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-sm font-medium text-slate-300 w-[80px]">ID</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300">Court</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300">Description</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300">Created</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300">Maintenance Date</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300">Status</TableHead>
                  <TableHead className="text-sm font-medium text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayReports.map((report) => (
                  <TableRow 
                    key={report.courtReportId} 
                    className="hover:bg-slate-700/30 cursor-pointer border-slate-700/50"
                    onClick={() => onSelectReport?.(report)}
                  >
                    <TableCell className="font-medium text-base text-white">#{report.courtReportId}</TableCell>
                    <TableCell className="text-base text-white">
                      <div>
                        <p className="font-medium">{report.courtName || `Court ${report.courtId}`}</p>
                        <p className="text-sm text-slate-400">{report.facilityName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-base text-slate-300">
                      {report.description}
                    </TableCell>
                    <TableCell className="text-base text-slate-300">
                      {formatDate(report.createdDate)}
                    </TableCell>
                    <TableCell className="text-base text-slate-300">
                      {formatDate(report.maintainDate)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(report.courtReportStatus)} font-medium px-3 py-1 text-sm`}>
                        {report.courtReportStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport?.(report);
                        }}
                        className="text-mint-400 hover:text-mint-500 font-medium text-base"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}; 