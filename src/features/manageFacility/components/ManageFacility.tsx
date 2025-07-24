import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import { Facility } from "../types";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UseGetAllFacility, UseApproveFacility, UseRejectFacility, UseToggleFacility } from "../hooks/useManageFacility";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";

const statusOptions = [
  { label: 'Tất cả', value: '' },
  { label: 'Đang chờ duyệt', value: '0' },
  { label: 'Đang hoạt động', value: '1' },
  { label: 'Đã từ chối', value: '2' },
  { label: 'Ngưng hoạt động', value: '3' },
];

export const ManageFacility = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 5;
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const statusString : string[] = ["Đang chờ duyệt", "Đang hoạt động",  "Đã từ chối", "Ngưng hoạt động"]
  // Đặt fetchFacilities ra ngoài useEffect để có thể gọi lại
  const fetchFacilities = async () => {
    try {
      const data = await UseGetAllFacility();
      // Nếu thành công
      const mapped = (data?.$values ?? []).map((item: any) => ({
        id: String(item.facilityId),
        name: item.facilityName,
        contactPhone: item.contactPhone,
        contactEmail: item.contactEmail,
        totalCourt: item.totalCourts,
        status: Number(item.facilityStatus)
      })).reverse();
      setFacilities(mapped);
      setShowError(false);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data?.message || "Lỗi dữ liệu máy chủ!");
      } else {
        setErrorMessage("Lỗi kết nối đến máy chủ!");
      }
      setShowError(true);
      setFacilities([]);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Filtered facilities theo status
  const filteredFacilities = statusFilter
    ? facilities.filter((f) => f.status === Number(statusFilter))
    : facilities;

  // Tính lại totalPages dựa trên filteredFacilities
  const totalPages = Math.ceil((filteredFacilities?.length || 0) / itemsPerPage);

  // Reset page về 1 khi filter thay đổi
  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter]);

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleApproveClick = async (facility: Facility) => {
    if (window.confirm(`Bạn có chắc chắn muốn duyệt cơ sở: ${facility.name}?`)) {
      try {
        const response = await UseApproveFacility({ facilityId: Number(facility.id) });
        if (response) {
          alert("Duyệt cơ sở thành công!");
          fetchFacilities();
        } else {
          setErrorMessage("Duyệt cơ sở thất bại");
          setShowError(true);
        }
      } catch (error) {
        setErrorMessage("Lỗi kết nối đến máy chủ!");
        setShowError(true);
        console.error(error);
      }
    }
  };

  const handleRejectClick = async (facility: Facility) => {
    if (window.confirm(`Bạn có chắc chắn muốn từ chối cơ sở: ${facility.name}?`)) {
      try {
        const response = await UseRejectFacility({ facilityId: Number(facility.id) });
        if (response) {
          alert("Từ chối cơ sở thành công!");
          fetchFacilities();
        } else {
          setErrorMessage("Từ chối cơ sở thất bại");
          setShowError(true);
        }
      } catch (error) {
        setErrorMessage("Lỗi kết nối đến máy chủ!");
        setShowError(true);
        console.error(error);
      }
    }
  };

  const handleToggleClick = async (facility: Facility) => {
    try {
      const response = await UseToggleFacility(Number(facility.id));
      if (response) {
        alert("Thay đổi trạng thái cơ sở thành công");
        setShowError(false);
        fetchFacilities();
      } else {
        setErrorMessage("Thay đổi trạng thái cơ sở thất bại");
        setShowError(true);
      }
    } catch (error) {
        setErrorMessage("Lỗi kết nối đến máy chủ!");
      setShowError(true);
      console.error(error);
    }
  };

  const facilitiesToShow = filteredFacilities?.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-blue-300/20 shadow-lg">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">Quản lý cơ sở</CardTitle>
          {/* Dropdown filter by Status */}
          <div className="mb-4">
            <label className="mr-2 font-medium">Lọc theo trạng thái:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="mt-6">
          <ErrorMessage message={errorMessage} show={showError} />
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {/* <TableHead>
                    <input
                      type="checkbox"
                      checked={selectedFacilities.size === mockFacilities.length && mockFacilities.length > 0}
                      onChange={handleSelectAll}
                    />
                  </TableHead> */}
                  <TableHead className="font-semibold">No.</TableHead>
                  <TableHead className="font-semibold">Mã cơ sở</TableHead>
                  <TableHead className="font-semibold">Tên cơ sở</TableHead>
                  <TableHead className="font-semibold">Số điện thoại</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Tổng sân</TableHead>
                  <TableHead className="font-semibold">Trạng thái</TableHead>
                  <TableHead className="font-semibold">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilitiesToShow?.map((facility, index) => (
                  <TableRow key={facility.id} className="hover:bg-muted/50">
                    {/* <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedFacilities.has(facility.id)}
                        onChange={() => handleSelectFacility(facility.id)}
                      />
                    </TableCell> */}
                    <TableCell>{(pageNumber - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell>{facility.id}</TableCell>
                    <TableCell>{facility.name}</TableCell>
                    <TableCell>{facility.contactPhone}</TableCell>
                    <TableCell>{facility.contactEmail}</TableCell>
                    <TableCell>{facility.totalCourt}</TableCell>
                    <TableCell>{statusString[facility.status]}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant={facility.status === 0? "primary" : "disabled"}
                        onClick={() => handleApproveClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status !== 0}
                      >
                        Duyệt
                      </Button>
                      <Button
                        variant={facility.status === 0 ? "danger" : "disabled"}
                        onClick={() => handleRejectClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status !== 0}
                      >
                        Từ chối
                      </Button>
                      <Button
                        variant={facility.status === 1 ? "danger" : "primary"}
                        onClick={() => handleToggleClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status === 0 || facility.status === 2}
                      >
                        {facility.status === 1 ? "Đình chỉ" : "Bật"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-6">
            <div className="inline-flex items-center gap-2 px-3 py-2">
              <Button
                variant="primary"
                onClick={() => handlePageChange(pageNumber - 1)}
                disabled={pageNumber === 1}
                className="cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium mx-2 whitespace-nowrap">Trang {pageNumber} / {totalPages}</span>
              <Button
                variant="primary"
                onClick={() => handlePageChange(pageNumber + 1)}
                disabled={pageNumber === totalPages}
                className="cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
