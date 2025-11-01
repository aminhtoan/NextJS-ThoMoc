import axiosClient from "./axiosClient";

const handleAPI = async (
  url: string,
  data?: any,
  method?: "post" | "put" | "get" | "delete"
) => {
  try {
    const response = await axiosClient({
      url, // Đảm bảo URL được đưa vào trong cấu hình
      method: method ?? "get",
      data, // Dữ liệu gửi lên cho các request như POST, PUT
    });
    if (response.status == 401) {
      console.log("check ccc");
    }
    return response; // Trả về dữ liệu từ API
  } catch (error: any) {
    throw error; // Quản lý lỗi nếu có
  }
};

export default handleAPI;
