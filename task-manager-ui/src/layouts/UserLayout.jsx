import React, { useState } from "react"; // THÊM: { useState }
import { Outlet } from "react-router-dom"; // BẮT BUỘC PHẢI CÓ
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
});
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        {/* Đây là "cửa sổ" để HomePage, CartPage... hiện ra */}
        <Outlet context={{ cart, setCart }} /> {/* THÊM: context={{ cart, setCart }} */}
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;