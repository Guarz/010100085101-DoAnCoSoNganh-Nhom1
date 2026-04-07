import React from "react";
import OrderCard from "../../components/OrderCard";
import "../../style/OrderCard.css";

const OrderPage = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <OrderCard />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
