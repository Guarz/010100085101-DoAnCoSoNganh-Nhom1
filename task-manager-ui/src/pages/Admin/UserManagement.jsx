import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../style/userManagement.css";
import "../../style/table.css";

function UserManagement() {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // ADD
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // EDIT
    const [editingUser, setEditingUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    // ========================
    // LOAD USERS
    // ========================
    const fetchUsers = () => {
        setLoading(true);

        axios.get("http://127.0.0.1:8000/api/admin/users")
            .then(res => {
                setUsers(res.data);
            })
            .catch(err => {
                console.log(err);
                alert("Lỗi tải dữ liệu");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ========================
    // ADD USER (FIX KHÔNG CẦN F5)
    // ========================
    const addUser = () => {

        if (!newName || !newEmail || !newPassword) {
            alert("Vui lòng nhập đủ thông tin");
            return;
        }

        axios.post("http://127.0.0.1:8000/api/admin/users", {
            name: newName,
            email: newEmail,
            password: newPassword
        })
            .then((res) => {

                const newUser = {
                    id: res.data.id,
                    name: newName,
                    email: newEmail
                };

                setUsers(prev => [newUser, ...prev]); // 🔥 update UI ngay

                alert("Thêm người dùng thành công");

                setShowAdd(false);
                setNewName("");
                setNewEmail("");
                setNewPassword("");
            })
            .catch((err) => {
                const msg = err.response?.data?.message || "Thêm thất bại";
                alert(msg);
            });
    };

    // ========================
    // DELETE (FIX KHÔNG CẦN F5)
    // ========================
    const deleteUser = (id) => {

        if (!window.confirm("Bạn chắc chắn muốn xoá user này?")) return;

        axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`)
            .then(() => {

                setUsers(prev => prev.filter(user => user.id !== id)); // 🔥 update UI

                alert("Xoá thành công");
            })
            .catch(() => {
                alert("Xoá thất bại");
            });
    };

    // ========================
    // EDIT
    // ========================
    const startEdit = (user) => {
        setEditingUser(user.id);
        setName(user.name);
        setEmail(user.email);
    };

    // ========================
    // UPDATE (FIX KHÔNG CẦN F5)
    // ========================
    const updateUser = () => {

        if (!name || !email) {
            alert("Vui lòng nhập đủ tên và email");
            return;
        }

        axios.put(`http://127.0.0.1:8000/api/admin/users/${editingUser}`, {
            name: name,
            email: email
        })
            .then(() => {

                setUsers(prev =>
                    prev.map(user =>
                        user.id === editingUser
                            ? { ...user, name: name, email: email }
                            : user
                    )
                );

                alert("Cập nhật thành công");

                setEditingUser(null);
            })
            .catch((err) => {
                const errMsg = err.response?.data?.message || err.message;
                alert("Thất bại: " + errMsg);
            });
    };

    // ========================
    // SEARCH
    // ========================
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <h3 style={{ textAlign: "center" }}>Đang tải dữ liệu...</h3>;
    }

    return (

        <div className="user-container">

            {/* HEADER */}
            <div className="user-header">

                <div>
                    <button
                        className="back-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Quay lại
                    </button>

                    <span className="user-title">
                        👤 Quản lý người dùng
                    </span>
                </div>

                <div>

                    <input
                        type="text"
                        placeholder="Tìm kiếm user..."
                        className="search-box"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button
                        className="reload-btn"
                        onClick={fetchUsers}
                    >
                        Reload
                    </button>

                    <button
                        className="add-btn"
                        onClick={() => setShowAdd(!showAdd)}
                    >
                        + Thêm user
                    </button>

                </div>
            </div>

            {/* ADD FORM */}
            {showAdd && (

                <div className="edit-box">

                    <h3>Thêm người dùng</h3>

                    <input
                        className="edit-input"
                        placeholder="Tên"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />

                    <input
                        className="edit-input"
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />

                    <input
                        className="edit-input"
                        placeholder="Mật khẩu"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <div className="edit-actions">

                        <button className="btn-update" onClick={addUser}>
                            Thêm
                        </button>

                        <button className="btn-cancel" onClick={() => setShowAdd(false)}>
                            Huỷ
                        </button>

                    </div>

                </div>
            )}

            {/* EDIT FORM */}
            {editingUser && (

                <div className="edit-box">

                    <h3>Sửa thông tin</h3>

                    <input
                        className="edit-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        className="edit-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="edit-actions">

                        <button className="btn-update" onClick={updateUser}>
                            Cập nhật
                        </button>

                        <button className="btn-cancel" onClick={() => setEditingUser(null)}>
                            Huỷ
                        </button>

                    </div>

                </div>
            )}

            {/* TABLE */}
            <table className="admin-table">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Hành động</th>
                    </tr>
                </thead>

                <tbody>

                    {filteredUsers.map(user => (

                        <tr key={user.id} className="table-row">

                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>

                            <td>

                                <button
                                    className="edit-btn"
                                    onClick={() => startEdit(user)}
                                >
                                    Sửa
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Xoá
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default UserManagement;