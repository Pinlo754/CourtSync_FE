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

export const ManageFacility = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(facilities?.length ?? 0 / itemsPerPage);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

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
        status:
          item.facilityStatus === "1"
            ? "Available"
            : item.facilityStatus === "0"
            ? "Pending"
            : item.facilityStatus === "2"
            ? "Rejected"
            : item.facilityStatus === "3"
            ? "Unavailable"
            : "Unknown",
      }));
      setFacilities(mapped);
      setShowError(false);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data?.message || "Server data error!");
      } else {
        setErrorMessage("An error occurred while connecting to the server!");
      }
      setShowError(true);
      setFacilities([]);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleApproveClick = async (facility: Facility) => {
    if (window.confirm(`Are you sure you want to approve facility: ${facility.name}?`)) {
      try {
        const response = await UseApproveFacility({ facilityId: Number(facility.id) });
        if (response) {
          alert("Facility approved successfully!");
          fetchFacilities();
        } else {
          setErrorMessage("Facility approval failed");
          setShowError(true);
        }
      } catch (error) {
        setErrorMessage("An error occurred while connecting to the server!");
        setShowError(true);
        console.error(error);
      }
    }
  };

  const handleRejectClick = async (facility: Facility) => {
    if (window.confirm(`Are you sure you want to reject facility: ${facility.name}?`)) {
      try {
        const response = await UseRejectFacility({ facilityId: Number(facility.id) });
        if (response) {
          alert("Facility rejected successfully!");
          fetchFacilities();
        } else {
          setErrorMessage("Facility rejection failed");
          setShowError(true);
        }
      } catch (error) {
        setErrorMessage("An error occurred while connecting to the server!");
        setShowError(true);
        console.error(error);
      }
    }
  };

  const handleToggleClick = async (facility: Facility) => {
    try {
      const response = await UseToggleFacility(Number(facility.id));
      if (response) {
        alert("Change facility status successfully");
        setShowError(false);
        fetchFacilities();
      } else {
        setErrorMessage("Change facility status failed");
        setShowError(true);
      }
    } catch (error) {
      setErrorMessage("An error occurred while connecting to the server!");
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
          <CardTitle className="text-2xl font-bold text-primary">Facility Management</CardTitle>
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
                  <TableHead className="font-semibold">Status</TableHead>
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
                    <TableCell>{facility.status}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button
                        variant={facility.status === "Pending" ? "primary" : "disabled"}
                        onClick={() => handleApproveClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status !== "Pending"}
                      >
                        Approve
                      </Button>
                      <Button
                        variant={facility.status === "Pending" ? "danger" : "disabled"}
                        onClick={() => handleRejectClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status !== "Pending"}
                      >
                        Reject
                      </Button>
                      <Button
                        variant={facility.status === "Available" ? "danger" : "primary"}
                        onClick={() => handleToggleClick(facility)}
                        className="cursor-pointer"
                        disabled={facility.status === "Pending" || facility.status === "Rejected"}
                      >
                        {facility.status === "Available" ? "Suspend" : "Activate"}
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
