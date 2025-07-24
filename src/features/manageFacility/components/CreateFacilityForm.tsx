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
      setError("Vui lòng điền đầy đủ các trường");
      return false;
    }
    if(formData.password) {
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có tối thiểu 6 ký tự");
        return false;
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
      if (!passwordRegex.test(formData.password)) {
        setError("Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
        return false;
      }
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
          setError("Lỗi nhập liệu"); // fallback
        }
      } else if (data?.message) {
        // Trường hợp backend trả về message riêng
        setError(data.message);
      } else {
        setError("Lỗi yêu cầu");
      }
    } else if (error.message?.includes("Network Error")) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
    } else {
      setError("Lỗi yêu cầu");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    validateForm();
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
      setSuccessMessage("Tạo chủ cơ sở thành công");
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
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Tạo chủ cơ sở</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name */}
            <div className="flex gap-8 justify-between">
              <Input
                label="Tên"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nhập tên"
                icon={User}
                labelClassName="text-slate-800 text-md font-bold"
                className="w-1/2 [&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
              />
              <Input
                label="Họ"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nhập họ"
                icon={User}
                labelClassName="text-slate-800 text-md font-bold"
                className="w-1/2 [&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
              />
            </div>
            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
              icon={Mail}
              labelClassName="text-slate-800 text-md font-bold"
              className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
            />
            {/* Password */}
            <Input
              label="Mật khẩu"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
              labelClassName="text-slate-800 text-md font-bold"
            />
            {/* Phone */}
            <Input
              label="Số điện thoại"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              icon={Phone}
              className="[&_input]:!bg-white [&_input]:!text-gray-900 [&_input]:!border-gray-300 [&_input]:!placeholder-gray-500 [&_input:focus]:!border-blue-500"
              labelClassName="text-slate-800 text-md font-bold"
            />
            {/* Submit Button */}
            <ErrorMessage message={error} show={!!error} />
            <SuccessMessage message={successMessage} show={!!successMessage}/>
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-mint-500 hover:bg-mint-700"
            >
              Tạo chủ cơ sở
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
