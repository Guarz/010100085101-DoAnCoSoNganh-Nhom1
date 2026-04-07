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

    // ========================
    // ADD USER
    // ========================
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // ========================
    // EDIT USER
    // ========================
    const [editingUser, setEditingUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    /*
    ========================
    LOAD USERS
    ========================
    */

    const fetchUsers = () => {
        axios.get("http://127.0.0.1:8000/api/admin/users")
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    /*
    ========================
    ADD USER
    ========================
    */

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
            .then(() => {
                alert("Thêm người dùng thành công");

                setShowAdd(false);
                setNewName("");
                setNewEmail("");
                setNewPassword("");

                fetchUsers();
            })
            .catch(() => {
                alert("Thêm thất bại");
            });
    };

    /*
    ========================
    DELETE
    ========================
    */

    const deleteUser = (id) => {

        if (!window.confirm("Bạn chắc chắn muốn xoá user này?")) return;

        axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`)
            .then(() => {
                alert("Xoá thành công");
                fetchUsers();
            })
            .catch(() => {
                alert("Xoá thất bại");
            });
    };

    /*
    ========================
    EDIT
    ========================
    */

    const startEdit = (user) => {
        setEditingUser(user.id);
        setName(user.name);
        setEmail(user.email);
    };

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
                alert("Cập nhật thành công");
                setEditingUser(null);
                fetchUsers();
            })
            .catch((err) => {

                const errMsg = err.response?.data?.message || err.message || "Lỗi không xác định";

                alert("Thất bại: " + errMsg);
            });
    };

    /*
    ========================
    SEARCH
    ========================
    */

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
                        style={{ marginLeft: "10px" }}
                        onClick={fetchUsers}
                    >
                        Reload
                    </button>

                    <button
                        className="add-btn"
                        style={{ marginLeft: "10px" }}
                        onClick={() => setShowAdd(!showAdd)}
                    >
                        + Thêm user
                    </button>

                </div>
            </div>


            {/* FORM ADD USER */}
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

                        <button
                            className="btn-update"
                            onClick={addUser}
                        >
                            Thêm
                        </button>

                        <button
                            className="btn-cancel"
                            onClick={() => setShowAdd(false)}
                        >
                            Huỷ
                        </button>

                    </div>

                </div>
            )}


            {/* FORM EDIT */}
            {editingUser && (

                <div className="edit-box">

                    <h3>Sửa thông tin người dùng</h3>

                    <input
                        className="edit-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên"
                    />

                    <input
                        className="edit-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />

                    <div className="edit-actions">

                        <button
                            className="btn-update"
                            onClick={updateUser}
                        >
                            Cập nhật
                        </button>

                        <button
                            className="btn-cancel"
                            onClick={() => setEditingUser(null)}
                        >
                            Huỷ
                        </button>

                    </div>

                </div>
            )}


            {/* TABLE */}

            <table className="user-table">

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