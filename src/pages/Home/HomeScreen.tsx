import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../../assets/avatar.png";
import banner from "../../assets/banner.jpg";
import court1 from "../../assets/court1.jpg";
const Home = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<string[]>([]);

  const options = ["Khoảng cách", "Giá mỗi giờ", "Đánh giá"];

  const handleChange = (value: string) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((item) => item !== value));
    } else {
      setFilters([...filters, value]);
    }
  };

  const [price, setPrice] = useState(50000);
  return (
    <div className="px-16 bg-blue-100 pb-16">
      <div className="flex h-20 w-full justify-between">
        <div className="flex justify-center items-center text-3xl font-bold font-montserrat text-center h-full">
          <p>CourtSync</p>
        </div>
        <div className="flex justify-between items-center text-2xl text-center h-full gap-6">
          <button>Menu1</button>
          <button>Menu2</button>
          <button>Menu3</button>
          <button className="flex ml-8">
            <p className="flex justify-center items-center">Profile</p>
            <img
              src={avatar}
              alt="profile"
              className="rounded-full ml-2 h-[40px]"
            />
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center">
        <div className="w-full relative">
          {" "}
          <img
            src={banner}
            alt="Banner"
            className="w-full object-cover rounded-3xl"
          />
          <p className="absolute right-[20%] top-[35%] text-4xl font-bold">
            Badminton
            <br />
            Court
          </p>
          <button className="absolute right-[23%] top-[60%] w-[10%] px-4 py-2 bg-green-500 text-white rounded-2xl hover:bg-green-600">
            Book Now
          </button>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold mt-12">Available courts</p>
        <div className="flex gap-4 mt-4 mb-8">
          <select className="border border-gray-300 rounded-[20px] h-[40px] px-4 py-2 text-gray-700">
            <option value="">filter</option>
            <option value="option1">filter1</option>
            <option value="option2">filter2</option>
          </select>
          <select className="border border-gray-300 rounded-[20px] h-[40px] px-4 py-2 text-gray-700">
            <option value="">filter</option>
            <option value="option1">filter1</option>
            <option value="option2">filter2</option>
          </select>
          <select className="border border-gray-300 rounded-[20px] h-[40px] px-4 py-2 text-gray-700">
            <option value="">filter</option>
            <option value="option1">filter1</option>
            <option value="option2">filter2</option>
          </select>
        </div>

        <div className="flex">
          <div className="flex flex-wrap gap-8 w-[60%]">
            <div className="bg-white rounded-2xl p-4 shadow-md w-[250px] h-[380px]">
              <img
                src={court1}
                alt="Court"
                className="w-full h-[150px] object-cover rounded-t-2xl"
              />
              <h3 className="text-xl font-semibold mt-2">
                Sân cầu lông Bằng Tâm
              </h3>
              <p className="text-gray-600 mt-2">Thủ Đức, Hồ Chí Minh</p>
              <p className="text-gray-600 mt-2">Price: 80.000đ/hour</p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-12 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Book Now
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md w-[250px] h-[380px]">
              <img
                src={court1}
                alt="Court"
                className="w-full h-[150px] object-cover rounded-t-2xl"
              />
              <h3 className="text-xl font-semibold mt-2">
                Sân cầu lông Bằng Tâm
              </h3>
              <p className="text-gray-600 mt-2">Thủ Đức, Hồ Chí Minh</p>
              <p className="text-gray-600 mt-2">Price: 80.000đ/hour</p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-12 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Book Now
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-md w-[250px] h-[380px]">
              <img
                src={court1}
                alt="Court"
                className="w-full h-[150px] object-cover rounded-t-2xl"
              />
              <h3 className="text-xl font-semibold mt-2">
                Sân cầu lông Bằng Tâm
              </h3>
              <p className="text-gray-600 mt-2">Thủ Đức, Hồ Chí Minh</p>
              <p className="text-gray-600 mt-2">Price: 80.000đ/hour</p>
              <button
                onClick={() => navigate("/booking")}
                className="mt-12 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="w-[40%] bg-gray-100 h-[380px] rounded-2xl p-4 shadow-md">
            <div className="p-4">
              <h2 className="text-lg font-bold mb-2">Sắp xếp:</h2>
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <label
                    key={option}
                    className="inline-flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={filters.includes(option)}
                      onChange={() => handleChange(option)}
                      className="accent-blue-500 w-4 h-4"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Đã chọn: {filters.length > 0 ? filters.join(", ") : "Không có"}
              </div>
            </div>

            <div className="pl-4 max-w-md">
              <h2 className="text-lg font-semibold mb-2">Lọc theo mức giá</h2>

              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="text-sm text-gray-700">
                  Mức giá: <span className="font-semibold">{price}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
