import React, { useState, useEffect } from "react";
import { CreateBookingStaff } from "../type";
import { useBookingStaff } from "../hooks/useBookingStaff";
import { Court } from "../type";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SuccessMessage } from "../../../components/ui/SuccessMessage";
import { Card, CardContent } from "../../../components/ui/card";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

const initialForm: CreateBookingStaff = {
  courtId: 0,
  startTimes: [new Date()],
  endTimes: [new Date()],
};

export const BookingStaffForm: React.FC = () => {
  const [form, setForm] = useState<CreateBookingStaff>(initialForm);
  const [facilityId, setFacilityId] = useState<string>("");
  const [courts, setCourts] = useState<Court[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { createBooking, getCourtsByFacilityId } = useBookingStaff();

  // Lấy danh sách courts khi facilityId thay đổi
  useEffect(() => {
    const fetchCourts = async () => {
      if (facilityId) {
        await getCourtsByFacilityId(Number(facilityId))
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

  // Xử lý thay đổi facilityId
  const handleFacilityIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacilityId(e.target.value);
    setForm((prev) => ({ ...prev, courtId: 0 })); // reset courtId khi đổi facility
    setError("");
    setSuccess("");
  };

  const handleFacilityIdBlur = () => {
    if (facilityId && Number(facilityId) > 0) {
      getCourtsByFacilityId(Number(facilityId))
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

  // Xử lý thay đổi courtId
  const handleCourtIdChange = (value: string) => {
    setForm((prev) => ({ ...prev, courtId: Number(value) }));
    setError("");
    setSuccess("");
  };

  // Xử lý thay đổi startTimes/endTimes
  const handleTimeChange = (
    type: "startTimes" | "endTimes",
    idx: number,
    value: string
  ) => {
    setForm((prev) => {
      const arr = [...prev[type]];
      arr[idx] = new Date(value);
      // Nếu là startTimes, đảm bảo endTimes có cùng số lượng
      if (type === "startTimes" && arr.length > prev.endTimes.length) {
        return { ...prev, [type]: arr, endTimes: [...prev.endTimes, new Date(value)] };
      }
      // Nếu là endTimes, đảm bảo startTimes có cùng số lượng
      if (type === "endTimes" && arr.length > prev.startTimes.length) {
        return { ...prev, [type]: arr, startTimes: [...prev.startTimes, new Date(value)] };
      }
      return { ...prev, [type]: arr };
    });
    setError("");
    setSuccess("");
  };

  // Thêm dòng thời gian mới (thêm cả startTimes và endTimes)
  const handleAddTime = (type: "startTimes" | "endTimes") => {
    setForm((prev) => {
      if (type === "startTimes" || type === "endTimes") {
        return {
          ...prev,
          startTimes: [...prev.startTimes, new Date()],
          endTimes: [...prev.endTimes, new Date()],
        };
      }
      return prev;
    });
  };

  // Xóa dòng thời gian (xóa cả startTimes và endTimes cùng index)
  const handleRemoveTime = (type: "startTimes" | "endTimes", idx: number) => {
    setForm((prev) => {
      const newStart = [...prev.startTimes];
      const newEnd = [...prev.endTimes];
      newStart.splice(idx, 1);
      newEnd.splice(idx, 1);
      return { ...prev, startTimes: newStart, endTimes: newEnd };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (
        !facilityId ||
        !form.courtId ||
        form.startTimes.length === 0 ||
        form.endTimes.length === 0
      ) {
        setError("Please enter all information!");
        setLoading(false);
        return;
      }
      // Validate: mỗi startTime phải có endTime, start < end
      for (let i = 0; i < form.startTimes.length; i++) {
        const start = form.startTimes[i];
        const end = form.endTimes[i];
        if (!start || !end) {
          setError(`Start time and end time at row ${i + 1} are required!`);
          setLoading(false);
          return;
        }
        if (new Date(start) >= new Date(end)) {
          setError(`Start time must be before end time at row ${i + 1}!`);
          setLoading(false);
          return;
        }
      }
      // Chuyển đổi Date sang string ISO
      const payload = {
        ...form,
        startTimes: form.startTimes.map((date) => date.toISOString()),
        endTimes: form.endTimes.map((date) => date.toISOString()),
      };
      await createBooking(payload);
      setSuccess("Create booking successfully!");
      setForm(initialForm);
    } catch (err: any) {
      setError("An error occurred while creating booking!");
    } finally {
      setLoading(false);
    }
  };

  function toLocalDatetimeInputValue(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      'T' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes())
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-blue-300/20 shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">
            Create booking
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Facility ID"
              name="facilityId"
              type="number"
              value={facilityId}
              onChange={handleFacilityIdChange}
              onBlur={handleFacilityIdBlur}
              placeholder="Enter facility id"
              icon={Calendar}
              labelClassName="text-slate-800 text-md font-bold"
            />
            <div>
              <label className="text-slate-800 text-md font-bold block mb-2">
                Court
              </label>
              <Select
                value={form.courtId ? String(form.courtId) : ""}
                onValueChange={handleCourtIdChange}
                disabled={!facilityId || courts?.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select court" />
                </SelectTrigger>
                <SelectContent className="bg-blue-200">
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
            {/* Danh sách Start/End Times */}
            <div>
              <label className="text-slate-800 text-md font-bold block mb-2">
                Booking Times
              </label>
              {form.startTimes.map((start, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    name={`startTime-${idx}`}
                    type="datetime-local"
                    value={start ? toLocalDatetimeInputValue(new Date(start)) : ""}
                    onChange={(e) => handleTimeChange("startTimes", idx, e.target.value)}
                    className="flex-1"
                    label=""
                  />
                  <span className="mx-2 font-bold">→</span>
                  <Input
                    name={`endTime-${idx}`}
                    type="datetime-local"
                    value={form.endTimes[idx] ? toLocalDatetimeInputValue(new Date(form.endTimes[idx])) : ""}
                    onChange={(e) => handleTimeChange("endTimes", idx, e.target.value)}
                    className="flex-1"
                    label=""
                  />
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => handleRemoveTime("startTimes", idx)}
                    className="ml-2"
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="adding"
                onClick={() => handleAddTime("startTimes")}
                className="mt-2"
              >
                Add time
              </Button>
            </div>
            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={success} show={!!success} />
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-mint-500 hover:bg-mint-700"
            >
              Create booking
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingStaffForm;
