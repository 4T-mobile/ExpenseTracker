# 📱 Student Expense Tracker

Ứng dụng **Quản lý Chi tiêu Sinh viên** giúp sinh viên ghi chép, theo dõi và quản lý chi tiêu cá nhân một cách đơn giản, trực quan.  
Dự án được xây dựng bằng **React Native**, chạy trên **Expo Go** và sử dụng **TypeScript** để đảm bảo tính an toàn và dễ mở rộng.

---

## 🚀 Tính năng chính

- **User Authentication**: Đăng ký / đăng nhập tài khoản để lưu trữ dữ liệu cá nhân.
- **Expense Tracker**: Nhập nhanh các khoản chi tiêu hằng ngày (ăn uống, đi lại, học phí...).
- **Budget & Alert**: Đặt ngân sách và cảnh báo khi vượt ngưỡng chi tiêu.
- **Statistics & Visualization**: Xem biểu đồ thống kê chi tiêu theo ngày/tuần/tháng.

---

## 🛠️ Công nghệ sử dụng

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)  
- [TypeScript](https://www.typescriptlang.org/)  
---

## 📂 Cấu trúc thư mục

```bash
.
├── assets/              # Ảnh, icon, font
├── src/
│   ├── components/      # Các component dùng chung
│   ├── modules/
│   │   ├── auth/        # Module đăng nhập/đăng ký
│   │   ├── expense/     # Module nhập chi tiêu
│   │   ├── budget/      # Module ngân sách
│   │   └── statistics/  # Module biểu đồ, thống kê
│   ├── navigation/      # Điều hướng (stack/tab)
│   └── utils/           # Helper & service
├── App.tsx              # Entry point chính
├── package.json
└── tsconfig.json
