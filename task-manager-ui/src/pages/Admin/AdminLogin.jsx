import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/adminLogin.css"; // Đảm bảo file CSS nằm đúng vị trí này

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                if (user?.role === "admin") {
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
            const res = await axios.post("http://127.0.0.1:8000/api/login", {
                email,
                password
            });

            if (res.data.success) {
                const user = res.data.user;
                if (user.role !== "admin") {
                    alert("Tài khoản này không có quyền truy cập quản trị!");
                    setLoading(false);
                    return;
                }
                localStorage.setItem("user", JSON.stringify(user));
                alert("Đăng nhập admin thành công!");
                window.location.href = "/admin/dashboard";
            } else {
                alert(res.data.message || "Đăng nhập thất bại");
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            const msg = error.response?.data?.message || "Sai tài khoản hoặc mật khẩu";
            alert(msg);
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                {/* Phần bên trái: Brand giống trang User */}
                <div className="admin-login-left">
                    <div className="brand-content">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4042/4042356.png"
                            alt="Fashion"
                            className="brand-icon"
                        />
                        <h1>SHOP QUẦN ÁO A</h1>
                        <p>Nâng tầm phong cách quản trị</p>
                    </div>
                </div>

                {/* Phần bên phải: Form đăng nhập */}
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
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                />
                                <span
                                    className="toggle-password"
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