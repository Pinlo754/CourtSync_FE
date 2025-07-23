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
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // For demo purposes - sample data
  const sampleReports: CourtReport[] = [
    {
      courtReportId: '1',
      createdBy: 'John Doe',
      createdDate: '2023-11-15T09:30:00',
      description: 'Court surface needs repair',
      courtReportStatus: CourtReportStatus.PENDING,
      courtId: 'C001',
      courtName: 'Tennis Court 1',
      facilityId: '1',
      facilityName: 'Sports Center Alpha',
      estimateTime: '2 days',
      maintainDate: '2023-11-20T10:00:00'
    },
    {
      courtReportId: '2',
      createdBy: 'Jane Smith',
      createdDate: '2023-11-14T14:15:00',
      description: 'Net replacement required',
      courtReportStatus: CourtReportStatus.IN_PROGRESS,
      courtId: 'C002',
      courtName: 'Basketball Court 2',
      facilityId: '1',
      facilityName: 'Sports Center Alpha',
      estimateTime: '1 day',
      maintainDate: '2023-11-16T09:00:00'
    },
    {
      courtReportId: '3',
      createdBy: 'Mike Johnson',
      createdDate: '2023-11-10T11:45:00',
      description: 'Lighting system malfunction',
      courtReportStatus: CourtReportStatus.COMPLETED,
      courtId: 'C003',
      courtName: 'Football Field 1',
      facilityId: '2',
      facilityName: 'Sports Center Beta',
      estimateTime: '3 days',
      maintainDate: '2023-11-13T13:30:00'
    },
    {
      courtReportId: '4',
      createdBy: 'Sarah Williams',
      createdDate: '2023-11-12T16:20:00',
      description: 'Seating area damage',
      courtReportStatus: CourtReportStatus.CANCELLED,
      courtId: 'C001',
      courtName: 'Tennis Court 1',
      facilityId: '1',
      facilityName: 'Sports Center Alpha',
      estimateTime: '4 days',
      maintainDate: null
    }
  ];

  const displayReports = reports.length > 0 ? reports : sampleReports;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Court Reports</h1>
        <p className="text-slate-400">Manage and track maintenance reports for your courts</p>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-700/50">
              <TableHead className="text-slate-300">Report ID</TableHead>
              <TableHead className="text-slate-300">Created By</TableHead>
              <TableHead className="text-slate-300">Created Date</TableHead>
              <TableHead className="text-slate-300">Court</TableHead>
              <TableHead className="text-slate-300">Description</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300">Estimate Time</TableHead>
              <TableHead className="text-slate-300">Maintain Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayReports.map((report) => (
              <TableRow 
                key={report.courtReportId} 
                className="hover:bg-slate-700/50 cursor-pointer"
                onClick={() => onSelectReport && onSelectReport(report)}
              >
                <TableCell className="font-medium text-white">#{report.courtReportId}</TableCell>
                <TableCell className="text-slate-300">{report.createdBy}</TableCell>
                <TableCell className="text-slate-300">{formatDate(report.createdDate)}</TableCell>
                <TableCell className="text-slate-300">{report.courtName || `Court ${report.courtId}`}</TableCell>
                <TableCell className="text-slate-300 max-w-xs truncate" title={report.description}>
                  <div className="max-w-[200px] truncate">{report.description}</div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusBadgeColor(report.courtReportStatus)} font-medium`}>
                    {report.courtReportStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-300">{report.estimateTime || 'Not specified'}</TableCell>
                <TableCell className="text-slate-300">{formatDate(report.maintainDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 