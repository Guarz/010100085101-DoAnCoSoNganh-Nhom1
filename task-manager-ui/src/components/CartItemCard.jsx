import React from "react";

const CartItemCard = ({
  item,
  isSelected,
  onToggle,
  onUpdateQty,
  onRemove,
}) => {
  return (
    <div className="cart-item-card bg-white p-3 mb-3 border rounded-4 shadow-sm">
      <div className="row align-items-center">
        <div className="col-lg-5 col-md-6 d-flex align-items-center mb-3 mb-md-0">
          <div className="form-check me-3">
            <input
              type="checkbox"
              className="form-check-input custom-checkbox"
              checked={isSelected}
              onChange={() => onToggle(item.IdSP)}
            />
          </div>
          <div className="d-flex align-items-center">
            <img
              src={item.HinhAnh || "https://via.placeholder.com/80"}
              alt={item.TenSP}
              className="rounded-3 border"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div className="ms-3">
              <h6
                className="mb-0 fw-bold text-dark text-truncate"
                style={{ maxWidth: "200px" }}
              >
                {item.TenSP}
              </h6>
              <small className="text-muted d-md-none">
                Đơn giá: {Number(item.Gia).toLocaleString()}₫
              </small>
            </div>
          </div>
        </div>

        <div className="col-lg-2 d-none d-lg-block text-center">
          <span className="text-muted">
            {Number(item.Gia).toLocaleString()}₫
          </span>
        </div>

        <div className="col-lg-2 col-md-3 col-6 d-flex justify-content-center align-items-center">
          <div className="cart-qty-wrapper">
            <button
              className="cart-qty-btn"
              onClick={() => onUpdateQty(item.IdSP, item.SoLuong - 1)}
              disabled={item.SoLuong <= 1}
            >
              <i className="bi bi-dash"></i>
            </button>

            <input
              type="number"
              className="cart-qty-input"
              value={item.SoLuong}
              readOnly
            />

            <button
              className="cart-qty-btn"
              onClick={() => onUpdateQty(item.IdSP, item.SoLuong + 1)}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div className="col-lg-2 col-md-2 col-4 text-end text-md-center fw-bold text-danger">
          {(Number(item.Gia) * item.SoLuong).toLocaleString()}₫
        </div>

        <div className="col-lg-1 col-md-1 col-2 text-end">
          <button
            className="btn btn-link p-0 btn-delete-item"
            onClick={() => onRemove(item.IdSP)}
          >
            <i className="bi bi-trash3 fs-5"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
