import React, { Component } from "react";
import { Link } from "react-router-dom";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import "../../css/margins-min.css";
// import '../../css/admin/sb-admin.css';
import "../../css/material-dashboard.css?v=2.1.1";
import "../../css/style.css";
import Adminheader from "./elements/admin_header";
import Adminsiderbar from "./elements/admin_sidebar";
import Footer from "./elements/footer";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_data: dt,
      data: 0,
      data1: 0,
      customer_count: 0,
      product_count: 0,
      userData: JSON.parse(localStorage.getItem("adminInfo")),
      permits: [],
    };
  }

  async componentDidMount() {
    const requestData = {};

    this.setState({ permits: await this.state.userData.user_role.modules });

    AdminApiRequest(requestData, "/admin/dashboard-counts", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            customer_count: res.data.data.customer_count,
            order_count: res.data.data.order_count,
            product_count: res.data.data.product_count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // product_count
  }

  checkPermit(element) {
    return this.state.permits.find((i) => {
      return i.toLowerCase() === element.toLowerCase();
    });
  }

  render() {
    return (
      <div className="wrapper ">
        {this.state.admin_data ? <Adminsiderbar /> : ""}
        <div className="main-panel">
          {this.state.admin_data ? <Adminheader /> : ""}
          <div className="content">
            <div className="container-fluid">
              <div className="row dashboard-home-h">
                {/* <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="card card-stats">
                            <div className="card-header card-header-warning card-header-icon">
                                <div className="card-icon">
                                    <i className="material-icons">store</i>
                                </div>
                                <p className="card-category">Total Stock</p>
                                <h3 className="card-title">{this.state.data}</h3>
                            </div>
                            <div className="card-footer">
                                <div className="stats" style={{marginLeft:'115px'}}>
                                    <Link to="admin-allstock">
                                        <i className="material-icons " style={{marginTop:'0px'}}>
                                            remove_red_eye
                                        </i> 
                                        view all
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div> */}
                {this.checkPermit("Order") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">shopping_cart</i>
                        </div>
                        <p className="card-category">Total Order</p>
                        <h3 className="card-title">{this.state.order_count}</h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/admin-orderdetails">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.checkPermit("customer") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_add</i>
                        </div>
                        <p className="card-category">Customer</p>
                        <h3 className="card-title">
                          {this.state.customer_count}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/admin-customer">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.checkPermit("Product") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                        <p className="card-category">Product</p>
                        <h3 className="card-title">
                          {this.state.product_count}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/admin-view-product">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="row dashboard-home-h">
                {this.checkPermit("Product") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                        <p className="card-category">10 Bestseller product</p>
                        {/* <h3 className="card-title">{this.state.product_count}</h3> */}
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/ten-bestseller-products">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.checkPermit("Category") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                        <p className="card-category">5 Bestseller category</p>
                        {/* <h3 className="card-title">{this.state.product_count}</h3> */}
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/five-bestseller-category">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {this.checkPermit("customer") ? (
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-warning card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                        <p className="card-category">Top 10 customers</p>
                        {/* <h3 className="card-title">{this.state.product_count}</h3> */}
                      </div>
                      <div className="card-footer">
                        <div className="stats" style={{ marginLeft: "115px" }}>
                          <Link to="/customer-based-order">
                            <i
                              className="material-icons "
                              style={{ marginTop: "0px" }}
                            >
                              remove_red_eye
                            </i>{" "}
                            view all
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Dashboard;
