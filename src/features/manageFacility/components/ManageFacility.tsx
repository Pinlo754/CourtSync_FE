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
import { UseGetAllFacility, UseSuspendFacility } from "../hooks/useManageFacility";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";

export const ManageFacility = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(facilities?.length ?? 0 / itemsPerPage);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
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
        }));
        setFacilities(mapped);
        setShowError(false);
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          setErrorMessage(error.response.data?.message || "Lỗi dữ liệu từ server!");
        } else {
          setErrorMessage("Có lỗi xảy ra khi kết nối server!");
        }
        setShowError(true);
        setFacilities([]);
      }
    };
    fetchFacilities();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleDetailClick = (facility: Facility) => {
    alert(`Detail of facility: ${facility.name}`);
  };

  const handleSuspendClick = async (facility: Facility) => {
    try {
      const response = await UseSuspendFacility(facility.id);
      if (response.status === 200) {
        alert("Suspend facility successfully");
        setShowError(false);
      } else {
        setErrorMessage("Suspend facility failed");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi kết nối server!");
      setShowError(true);
      console.error(error);
    }
  };

  const facilitiesToShow = facilities?.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-blue-300/20 shadow-lg">
        <CardHeader className="bg-primary/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-primary">Quản lý Facility</CardTitle>
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
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Contact Phone</TableHead>
                  <TableHead className="font-semibold">Contact Email</TableHead>
                  <TableHead className="font-semibold">Total Court</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
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
                    <TableCell>{facility.name}</TableCell>
                    <TableCell>{facility.contactPhone}</TableCell>
                    <TableCell>{facility.contactEmail}</TableCell>
                    <TableCell>{facility.totalCourt}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant="primary"
                        onClick={() => handleDetailClick(facility)}
                        className="cursor-pointer"
                      >
                        Detail
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleSuspendClick(facility)}
                        className="cursor-pointer"
                      >
                        Suspend
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
              <span className="text-sm font-medium mx-2 whitespace-nowrap">Page {pageNumber} of {totalPages}</span>
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
