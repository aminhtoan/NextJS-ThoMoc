# Shopping App Client (Next.js)

Frontend cho hệ thống thương mại điện tử, xây dựng bằng Next.js + TypeScript.
Ứng dụng cung cấp giao diện cho khách hàng và quản trị, kết nối API backend NestJS.

## Cấu trúc thư mục

```text
client/
├─ public/                     # Tài nguyên tĩnh (images, locales, svgs)
├─ src/
│  ├─ apis/                    # Cấu hình axios và hàm gọi API
│  ├─ components/              # Component dùng chung (UI, Auth, Modal, Table...)
│  ├─ configs/                 # Cấu hình app (api, auth, i18n, route, acl...)
│  ├─ contexts/                # React Context (Auth, Settings)
│  ├─ hooks/                   # Custom hooks
│  ├─ pages/                   # Các trang theo chuẩn Next.js Pages Router
│  ├─ service/                 # Service nghiệp vụ
│  ├─ stores/                  # Redux Toolkit store và slices
│  ├─ styles/                  # SCSS/CSS global
│  ├─ theme/                   # Theme và tùy biến giao diện
│  ├─ types/                   # TypeScript types/interfaces
│  ├─ utils/                   # Hàm tiện ích
│  └─ views/                   # UI theo màn hình/feature
├─ next.config.js              # Cấu hình Next.js
├─ tsconfig.json               # Cấu hình TypeScript
└─ package.json                # Scripts và dependencies
```

## Chức năng chính

- Đăng ký, đăng nhập, social login (Google/Facebook)
- Quản lý tài khoản người dùng, phiên đăng nhập, bảo mật OTP/verify
- Hiển thị sản phẩm, danh mục, tìm kiếm, giỏ hàng, checkout
- Quản lý đơn hàng và theo dõi trạng thái đơn
- Đánh giá sản phẩm
- Phân quyền và khu vực quản trị (ACL + role/permission)
- Đa ngôn ngữ (i18n)
- Tích hợp chat AI và realtime qua socket

## Cách sử dụng

1. Cài đặt dependencies:

```bash
cd client
npm install
```

2. Tạo file `.env` trong thư mục `client`:

```env
URL_API=http://localhost:8888/api
```

3. Chạy môi trường development:

```bash
npm run dev
```

4. Build production:

```bash
npm run build
```

5. Chạy bản production local:

```bash
npm run start
```

6. Kiểm tra lint/format:

```bash
npm run lint
npm run lint:fix
npm run format
```

## Ghi chú

- Frontend mặc định chạy tại `http://localhost:3000`
- Cần chạy backend trước để các chức năng API hoạt động đúng
