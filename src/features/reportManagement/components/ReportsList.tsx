import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/badge';
import { CourtReport, CourtReportStatus } from '../types';
import { format } from 'date-fns';
import { Search, Filter } from 'lucide-react';
import { REPORT_STATUS_COLORS } from '../constants';

interface ReportsListProps {
  reports: CourtReport[];
  isLoading: boolean;
  error: string | null;
  onSelectReport?: (report: CourtReport) => void;
  key?: number; // Add key prop for refreshing
}

export const ReportsList: React.FC<ReportsListProps> = ({ 
  reports, 
  isLoading, 
  error, 
  onSelectReport 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourtReportStatus | 'all'>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');

  // Get unique facilities for filter
  const facilities = reports.reduce<{ id: string; name: string }[]>((acc, report) => {
    if (report.facilityId && report.facilityName && !acc.some(item => item.id === report.facilityId)) {
      acc.push({ id: report.facilityId, name: report.facilityName });
    }
    return acc;
  }, []);

  const getStatusBadgeColor = (status: CourtReportStatus) => {
    return REPORT_STATUS_COLORS[status]?.badge || REPORT_STATUS_COLORS.DEFAULT.badge;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setFacilityFilter('all');
  };

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    // Filter by status
    if (statusFilter !== 'all' && report.courtReportStatus !== statusFilter) {
      return false;
    }
    
    // Filter by facility
    if (facilityFilter !== 'all' && report.facilityId !== facilityFilter) {
      return false;
    }
    
    // Filter by search query (ID, description, court name, facility name)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.courtReportId.toString().includes(query) ||
        report.description.toLowerCase().includes(query) ||
        (report.courtName?.toLowerCase() || '').includes(query) ||
        (report.facilityName?.toLowerCase() || '').includes(query)
      );
    }
    
    return true;
  });

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Court Reports</h1>
        <p className="text-slate-300">Manage and track maintenance reports for your courts</p>
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-mint-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-700/70 border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>
            
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CourtReportStatus | 'all')}
                className="bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner appearance-none pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2380CBC4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="all">All Statuses</option>
                <option value={CourtReportStatus.PENDING}>Pending</option>
                <option value={CourtReportStatus.IN_PROGRESS}>In Progress</option>
                <option value={CourtReportStatus.COMPLETED}>Completed</option>
                <option value={CourtReportStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            <div>
              <select
                value={facilityFilter}
                onChange={(e) => setFacilityFilter(e.target.value)}
                className="bg-slate-700/70 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:border-mint-500 focus:ring-1 focus:ring-mint-500 focus:outline-none transition-all shadow-inner appearance-none pr-10 relative"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2380CBC4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
              >
                <option value="all">All Facilities</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
            </div>
            
            {(!!searchQuery || statusFilter !== 'all' || facilityFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium rounded-lg transition-all flex items-center gap-2 border border-red-500/20 hover:border-red-500/30"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </button>
            )}
          </div>
          
          {(!!searchQuery || statusFilter !== 'all' || facilityFilter !== 'all') && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-slate-400">Active filters:</span>
              {!!searchQuery && (
                <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Search: {searchQuery}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                  Status: {statusFilter}
                </span>
              )}
              {facilityFilter !== 'all' && (
                <span className="bg-mint-500/20 text-mint-300 py-1 px-3 rounded-full flex items-center gap-1">
                  Facility: {facilities.find(f => f.id === facilityFilter)?.name || facilityFilter}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No Reports Found</h3>
            <p className="text-slate-400 text-lg">
              {(!!searchQuery || statusFilter !== 'all' || facilityFilter !== 'all') 
                ? 'No reports match your current filters.' 
                : 'There are no maintenance reports for your courts yet.'}
            </p>
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
                {filteredReports.map((report) => (
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