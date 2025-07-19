import React, { useState } from "react";
import banner from "../../../assets/banner.jpg";
import { CreateFacilityOwnerForm } from "../types";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { ErrorMessage } from "../../../components/ui/ErrorMessage";
import { SuccessMessage } from "../../../components/ui/SuccessMessage";
import { Card, CardContent } from "../../../components/ui/card";
import { Mail, User, Phone } from "lucide-react";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { UseCreateFacility } from "../hooks/useCreateFacility";
import { es } from "date-fns/locale";

export const CreateFacilityForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateFacilityOwnerForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    if (
      !formData.email ||
      !formData.password ||
      !formData.lastName ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };
  const handleError = (error: any): void => {
    if (error.response?.status === 400) {
      const data = error.response.data;

      if (data?.errors && typeof data.errors === "object") {
        // Lấy lỗi đầu tiên từ object errors
        const errorValues = Object.values(data.errors);

        if (errorValues.length > 0 && Array.isArray(errorValues[1])) {
          setError(errorValues[1][0]);
        } else {
          setError("Invalid input"); // fallback
        }
      } else if (data?.message) {
        // Trường hợp backend trả về message riêng
        setError(data.message);
      } else {
        setError("Invalid request");
      }
    } else if (error.message?.includes("Network Error")) {
      setError("Unable to connect to server. Please try again later.");
    } else {
      setError("Invalid request");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }
      const response = await UseCreateFacility(formData);
      console.log(response);
      setSuccessMessage("Facility owner created successfully");
      setFormData(formData);
      // setTimeout(() => {
      //   setSuccessMessage("");
      // }, 3000);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-blue-300/20 shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Create Facility Owner
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name */}
            <div className="flex gap-8 justify-between">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                icon={User}
                className="w-1/2"
                labelClassName="text-slate-800 text-md font-bold"
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                icon={User}
                className="w-1/2"
                labelClassName="text-slate-800 text-md font-bold"
              />
            </div>
            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              icon={Mail}
              labelClassName="text-slate-800 text-md font-bold"
            />
            {/* Password */}
            <Input
              label="Password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              labelClassName="text-slate-800 text-md font-bold"
            />
            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone"
              icon={Phone}
              labelClassName="text-slate-800 text-md font-bold"
            />
            {/* Submit Button */}
            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={successMessage} show={!!successMessage} />
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-mint-500 hover:bg-mint-700"
            >
              Create Facility Owner
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
