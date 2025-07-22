import { Save, Trash2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { UseUploadFirebase } from "../../uploadImage/hooks/useUploadFirebase";
import { ReportIssueRequest } from "../types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { useBookingStaff } from "../../staffBooking/hooks/useBookingStaff";
import { Button } from "../../../components/ui/Button";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "../../../components/ui/card";
import { useReportIssue } from "../hooks/useReportIssue";
import { SuccessMessage } from "../../../components/ui/SuccessMessage";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";

const initialForm: ReportIssueRequest = {
  courtId: 0,
  issueDescription: "",
  imageUrl: "",
};

export const ReportIssueForm = () => {
  const [form, setForm] = useState<ReportIssueRequest>(initialForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getFacilityIdByStaffId, getCourtsByFacilityId } = useBookingStaff();
  const [facilityId, setFacilityId] = useState<number>(0);
  const [courts, setCourts] = useState<
    { courtId: number; courtName: string }[]
  >([]);
  const [successMessage, setSuccessMessage] = useState("");
  const { reportIssue } = useReportIssue();

  useEffect(() => {
    const fetchCourts = async () => {
      const facilityId = await getFacilityIdByStaffId();
      setFacilityId(facilityId);
      if (facilityId) {
        await getCourtsByFacilityId(facilityId)
          .then((data) => {
            const apiCourts = data.$values || data || [];
            const mappedCourts = apiCourts.map((id: number) => ({
              courtId: id,
              courtName: `Court ${id}`,
            }));
            setCourts(mappedCourts);
          })
          .catch(() => setCourts([]));
      } else {
        setCourts([]);
      }
    };
    fetchCourts();
  }, [facilityId]);

  // Xử lý thay đổi courtId
  const handleCourtIdChange = (value: string) => {
    setForm((prev) => ({ ...prev, courtId: Number(value) }));
    setError("");
    setSuccess("");
  };

  const handleIssueDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, issueDescription: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (match Firebase upload requirements)
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, GIF, and WebP image files are allowed");
        return;
      }

      // Validate file size (max 5MB - same as Firebase upload)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("Image size must be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError("");
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Firebase upload function
  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Use Firebase upload functionality
      const url = await UseUploadFirebase(file, () => {});
      return url;
    } catch (error: any) {
      console.error("Firebase upload error:", error);

      // Provide user-friendly error messages
      if (error.message.includes("Firebase Storage is not configured")) {
        throw new Error(
          "Upload service is not configured. Please contact support."
        );
      } else if (
        error.message.includes("File type") &&
        error.message.includes("not supported")
      ) {
        throw new Error("Only image files (JPG, PNG, GIF, WebP) are allowed.");
      } else if (error.message.includes("File size too large")) {
        throw new Error("Image size must be less than 5MB.");
      } else if (error.message.includes("quota-exceeded")) {
        throw new Error("Upload quota exceeded. Please try again later.");
      } else if (error.message.includes("unauthorized")) {
        throw new Error("Upload failed: Unauthorized access.");
      } else if (error.message.includes("retry-limit-exceeded")) {
        throw new Error(
          "Upload failed due to network issues. Please check your connection and try again."
        );
      } else {
        throw new Error(error.message || "Upload failed. Please try again.");
      }
    }
  };

  const validateForm = (): boolean => {
    if (!form.courtId) {
      setError("Court is required");
      return false;
    }

    if (!form.issueDescription.trim()) {
      setError("Issue description is required");
      return false;
    }

    if (!selectedImage) {
      setError("Image is required");
      return false;
    }

    return true;
  };
  
  const handleClose = () => {
    setForm(initialForm);
    setError("");
    setSuccess("");
    setSelectedImage(null);
    setImagePreview("");
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Upload image
      let imageUrl = "";
      if (selectedImage) {
        setSuccessMessage("Uploading image...");
        try {
          imageUrl = await uploadImage(selectedImage);
          setSuccessMessage("Image uploaded successfully! Creating court...");
        } catch (uploadError: any) {
          console.error("Image upload failed:", uploadError);
          setError(
            uploadError.message || "Failed to upload image. Please try again."
          );
          return;
        }
      }

      // Report issue
      const result = await reportIssue(form);

      if (result) {
        setSuccessMessage("Reported successfully!");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError(result.message || "Failed to report issue");
      }
    } catch (error: any) {
      console.error("Error reporting issue:", error);

      // More specific error handling
      if (error.message?.includes("Firebase")) {
        setError("Upload service error. Please try again or contact support.");
      } else if (error.message?.includes("Network")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          "An error occurred while reporting the issue. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle>Report Issue</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Error/Success Messages */}
        <ErrorMessage message={error} show={!!error} />
        <SuccessMessage message={successMessage} show={!!successMessage} />
        {/* Form */}
        <div className="flex gap-6">
          {/* Information */}
          <div className=" w-1/2">
            {/* Court id */}
            <div className="space-y-3 mb-6">
              <label className="text-md font-medium text-slate-700">
                Court ID
              </label>
              <Select
                value={form.courtId ? String(form.courtId) : ""}
                onValueChange={handleCourtIdChange}
                disabled={!facilityId || courts?.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent className="bg-blue-100">
                  {courts?.map((court) => (
                    <SelectItem
                      key={court.courtId}
                      value={String(court.courtId)}
                    >
                      {court.courtName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Description */}
            <div className="space-y-3 mb-6">
              <label className="text-md font-medium text-slate-700">
                Issue Description
              </label>
              <textarea
                className="w-full h-56 p-4 bg-white border-2 border-slate-600/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-500"
                placeholder="Enter issue description..."
                onChange={handleIssueDescriptionChange}
                value={form.issueDescription}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3 w-1/2">
            <label className="text-md font-medium text-slate-700">
              Court Image *
            </label>

            {/* Image Upload Area */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-96 bg-slate-700/50 border-2 border-dashed border-slate-600/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-mint-500/50 hover:bg-slate-700/70 transition-all duration-300"
              >
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-slate-400 text-sm text-center">
                  Click to upload court image
                  <br />
                  <span className="text-xs">PNG, JPG up to 5MB</span>
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Court preview"
                  className="w-full h-96 object-cover rounded-xl border-2 border-slate-600/50"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end space-x-3 mt-5 pt-4 border-t border-slate-600/50">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isLoading}
            className="px-6 py-3"
          >
            Cancel
          </Button>
          <Button
            type="button"
            loading={isLoading}
            icon={Save}
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-mint-500 to-blue-500 hover:from-mint-600 hover:to-blue-600"
          >
            Report Issue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
