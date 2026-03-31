import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/adminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // 1. Kiểm tra nếu đã đăng nhập rồi thì vào thẳng Dashboard
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Vì bạn dùng bảng admin riêng, nên mọi user ở đây mặc định là admin
                if (user) {
                    navigate("/admin/dashboard", { replace: true });
                }
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        setLoading(true);

        try {
            // 2. Gọi đến API kết nối bảng admin mới
            const res = await axios.post("http://127.0.0.1:8000/api/admin-login", {
                email,
                password
            });

            if (res.data.success) {
                // Lưu thông tin vào localStorage để các trang khác kiểm tra
                const adminData = {
                    ...res.data.user,
                    isAdmin: true // Đánh dấu đây là admin
                };

                localStorage.setItem("user", JSON.stringify(adminData));
                alert("Đăng nhập hệ thống quản trị thành công!");

                // Dùng navigate thay vì window.location để tránh lỗi load trang
                navigate("/admin/dashboard");
            } else {
                alert(res.data.message || "Sai tài khoản hoặc mật khẩu");
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Không thể kết nối đến máy chủ";
            alert(msg);
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div className="admin-login-left">
                    <div className="brand-content">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                            alt="Fashion"
                            className="brand-icon"
                        />
                        {/* Tên dự án của bạn */}
                        <h1>SHOP QUẦN ÁO A</h1>
                        <p>Nâng tầm phong cách quản trị</p>
                    </div>
                </div>

                <div className="admin-login-right">
                    <div className="form-header">
                        <h2>Admin Login</h2>
                        <p>Vui lòng nhập thông tin hệ thống</p>
                    </div>

                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="input-group">
                            <label>Email Admin</label>
                            <input
                                type="email"
                                placeholder="admin@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <div className="input-group">
                            <label>Mật khẩu</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                                <span
                                    className="toggle-password"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-admin-submit">
                            {loading ? "⚡ Đang xác thực..." : "Đăng nhập hệ thống"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;