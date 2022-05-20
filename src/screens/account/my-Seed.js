import moment from "moment";
import "moment-timezone";
import React from "react";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import DynamicUrl from "../../main_url";
import Sidebar from "../main_sidebar/sidebar";
import OrderPopup from "./OrderPopup";

class Myseeds extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      all_order: [],
      order_status_show: "orders",
      order_detail: [],
      skip: 0,
      count: 1,
      limit: 20,
      loading: true,
      currentPage: 1,

      TotalPoint: 0,
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
      loading: true,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    const requestData = {
      skip: skip,
      limit: this.state.limit,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/loyality/LoyalityHistoryOfAllUser", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_order: res.data.data,
            totalPoint: res.data.data[0].user_id.TotalPoint.toFixed(2),
          });
        } else if (res.status !== 503) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _handleForm(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }
  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };
  forward = (ev) => {
    let name = this.state.name;
    let email = this.state.email;
    let address = this.state.address;
    let password = this.state.password;
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    } else if (email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "";
    } else if (email.match(mailformat)) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail Address";
    }

    if (!password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "This Field is Required";
    } else if (password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    } else if (name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "";
    }
    if (!address) {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "This Field is Required";
    } else if (address) {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "";
    }
  };
  openModal(ev, dt) {
    this.setState({
      order_detail: ev,
      userAddress:
        typeof ev.booking_address === "object"
          ? ev.booking_address
          : JSON.parse(ev.booking_address),
    });
    this.setState({ modalIsOpen: true });
  }
  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };
  componentWillReceiveProps() {}

  componentWillUnmount() {}

  downloadInvoice = (bookingCode) => {
    const requestData = {
      booking_code: bookingCode,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/invoice/generate", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            DynamicUrl + res.data.pdf.filename,
            "_blank",
            "noopener,noreferrer"
          );
          if (newWindow) newWindow.opener = null;
        } else {
          swal({
            title: "Error",
            text: "Try Again !",
            icon: "warning",
            successMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  repeatOrder = (bookingCode) => {
    const requestData = {
      booking_code: bookingCode,
      regionId: JSON.parse(localStorage.getItem("selectedRegionId")),
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/re-order", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          if (res.data.data.CartDetail.length === 0) {
            swal({
              title: "Currently Out Of Stock !",
              text: "",
              icon: "warning",
              successMode: true,
            });
          } else {
            this.props.history.push("/cart");
          }
        } else {
          swal({
            title: "Error",
            text: "Try Again !",
            icon: "warning",
            successMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  orderdetails() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/loyality/LoyalityHistoryOfAllUser", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_order: res.data.data,
            totalPoint: res.data.data[0].user_id.TotalPoint.toFixed(2),
            count: res.data.count,
          });
        } else if (res.status !== 503) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        } else if (res.status === 503) {
          // alert("Please Login Again");
          // window.location = "/";
          // localStorage.setItem("contact", "");
          // let a = [];
          // this.props.userdetails(a);
          // this.props.addToCart(a);
          // localStorage.clear();
        } else {
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  openSelectedOrder = (e, order) => {
    e.preventDefault();
    this.setState({ order_detail: order });

    setTimeout(() => {
      this.setState({ modalIsOpen: true });
    }, 50);
  };

  componentDidMount() {
    this.orderdetails();
  }
  render() {
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <Sidebar active="my-seed"></Sidebar>
              <div className="right_m_content">
                <h2>
                  Seeds -{" ("}
                  {this.state.totalPoint !== undefined
                    ? this.state.totalPoint.split(".")[0]
                    : 0}
                  {" seeds)"}
                </h2>
                {/* <div>
                  Total Krishi Seeds -{" "}
                  <span>
                    
                  </span>
                </div> */}
                <div className="seed-wrap-box">
                  <table
                    border="0"
                    cellspacing="0"
                    className="order-table seed-data-profile text-center"
                  >
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Credit/Debit</th>
                        <th>Seeds</th>
                        <th>OrderID</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.all_order &&
                      this.state.all_order.length > 0 ? (
                        this.state.all_order.map((item, index) => (
                          <tr>
                            <td>{moment(item.created_at).format("LLL")}</td>
                            <td>
                              {item.pointStatus === "add" ||
                              item.pointStatus === "Added"
                                ? "Credit"
                                : "Debit"}
                            </td>
                            <td
                              style={{
                                color:
                                  item.pointStatus === "add" ||
                                  item.pointStatus === "Added"
                                    ? "green"
                                    : "red",
                              }}
                            >
                              {item.pointStatus === "add" ||
                              item.pointStatus === "Added"
                                ? "+ "
                                : "- "}
                              {item.point}
                            </td>
                            <td
                              onClick={(e) =>
                                this.openSelectedOrder(e, item.orderID)
                              }
                              style={{
                                color: "#febc15",
                                textDecoration: "none",
                                cursor: "pointer",
                              }}
                            >
                              {item.booking_code}
                            </td>
                            <td>{item.reason}</td>
                          </tr>
                        ))
                      ) : this.state.loading === true ? (
                        <ReactLoading type={"cylon"} color={"#febc12"} />
                      ) : (
                        <tr>
                          <td colSpan="4" style={{ textAlign: "center" }}>
                            No Seeds History Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <Pagination
                    hideNavigation
                    activePage={this.state.currentPage}
                    itemsCountPerPage={this.state.limit}
                    totalItemsCount={this.state.count}
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* // order modal start */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          className="adding-address"
          contentLabel="Add Address"
          scrollable={true}
        >
          <OrderPopup order_detail={this.state.order_detail} />
        </Modal>
        {/* // order modal end */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Myseeds);
