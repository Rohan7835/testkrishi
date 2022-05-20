import moment from "moment";
import React from "react";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { DynamicUrl } from "../../dynamicurl";
import Sidebar from "../main_sidebar/sidebar";
import OrderPopup from "./OrderPopup";

class wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order_detail: {},
      modalIsOpen: false,
      addModal: false,
      loading: true,
    };
  }

  formHandler(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  openSelectedOrder = (e, order) => {
    e.preventDefault();
    this.setState({ order_detail: order });
    // if(order){
    // }else{
    //   this.setState({ order_detail: subscription });
    // }

    setTimeout(() => {
      this.setState({ modalIsOpen: true });
    }, 50);
  };
  openModal = () => {
    this.setState({
      addModal: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      modalIsOpenedit: false,
    });
  };
  save = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var submit_status = true;
    if (!this.state.amount) {
      submit_status = false;
      valueErr = document.getElementsByClassName("err_amount");
      valueErr[0].innerText = "Field is Required";
    } else if (isNaN(this.state.amount)) {
      submit_status = false;
      valueErr = document.getElementsByClassName("err_amount");
      valueErr[0].innerText = "Enter Numeric Value";
    } else if (this.state.amount < 1000) {
      submit_status = false;
      valueErr = document.getElementsByClassName("err_amount");
      valueErr[0].innerText = "Recharge with Minimun Value of 1000";
    }

    if (submit_status === true) {
      const requestData = {
        amount: this.state.amount,
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      fetch(DynamicUrl + "/wallet/addMoney", {
        method: "post",
        headers: {
          "content-type": "application/json",
          authorization: token ? token : "",
        },
        body: JSON.stringify(requestData),
      })
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            return res.text();
          } else if (res.status === 400 || res.status === 401) {
            alert(
              "Your Account Is Currently Disabled.Please Contact Us For More."
            );
          }
        })
        .then((data) => {
          if (data !== undefined) {
            document.querySelector("html").innerHTML = data;
            document.f1.submit();
          }

          // this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
      // ApiRequest(requestData, "/wallet/addMoney", "POST")
      //   .then((data) => {
      //     if (data !== undefined) {
      //       document.querySelector("html").innerHTML = data;
      //       document.f1.submit();
      //     }

      //     // this.forceUpdate();
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    }
  };

  walletdetails() {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/wallet/getUserTransactions", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_data: res.data.data,
          });
        } else if (res.status !== 503) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((error) => {
        console.log(error);
      });
    ApiRequest(requestData, "/wallet/getUserWalletAmount", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            wallet_amount: res.data.data.walletAmount,
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
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.walletdetails();
  }

  truncateToDecimals = (num, dec = 2) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  render() {
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <Sidebar active="my-wallet"></Sidebar>
              <div className="right_m_content">
                <div className="managing_adding_new">
                  <h2 className="right-wallet-manage">
                    Wallet -{" ( ₹"}
                    {this.state.wallet_amount !== undefined ? (
                      this.state.wallet_amount > 0 ? (
                        <>{this.state.wallet_amount.toFixed(2)}</>
                      ) : (
                        <>0</>
                      )
                    ) : (
                      <>0</>
                    )}
                    {" )"}
                  </h2>
                  <div className="managing_adding_inner_new">
                    <button
                      type="button"
                      className="add_addres"
                      onClick={() => this.openModal()}
                    >
                      Add Money
                    </button>
                  </div>

                  <div className="seed-wrap-box">
                    <table border="0" cellspacing="0" className="order-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Credit/Debit</th>
                          <th>Amount</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.all_data &&
                        this.state.all_data.length > 0 ? (
                          this.state.all_data.map((item, index) => (
                            <tr>
                              <td>{moment(item.created_at).format("LLL")}</td>
                              <td style={{ textTransform: "uppercase" }}>
                                {item.type}{" "}
                                <a
                                  href="#"
                                  onClick={(e) =>
                                    this.openSelectedOrder(
                                      e,
                                      item.orderID || item.subscription_id
                                    )
                                  }
                                  style={{
                                    color: "#febc15",
                                    textDecoration: "none",
                                  }}
                                >
                                  {item.booking_code || item.SubscriptionID}
                                </a>
                              </td>
                              <td
                                style={
                                  item.type === "debit"
                                    ? { color: "red" }
                                    : { color: "green" }
                                }
                              >
                                {item.type === "debit" ? "- " : "+ "}₹
                                {item.amount}
                              </td>
                            </tr>
                          ))
                        ) : this.state.loading === true ? (
                          <ReactLoading type={"cylon"} color={"#febc12"} />
                        ) : (
                          <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                              Your Wallet is Empty
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div>
                {/* add modal */}
                <Modal
                  isOpen={this.state.addModal}
                  onRequestClose={() => this.setState({ addModal: false })}
                  className="adding-address"
                  contentLabel="Add Address"
                >
                  <div role="dialog">
                    <div className="modal-dialog manage-add NEW_ADD_NEW">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.setState({ addModal: false })}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Add Money to Wallet</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Amount
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="amount"
                                  className="form-control"
                                  placeholder="Enter Amount"
                                  value={this.state.address}
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                <span className="focus-border"></span>
                                <span className="err err_amount"></span>
                              </div>
                            </div>

                            <div className="modal-bottom">
                              <button
                                type="button"
                                className="submit fill-btn"
                                onClick={() => this.save()}
                              >
                                <span className="button-text">Add</span>
                                <span className="button-overlay"></span>
                              </button>
                            </div>
                            <p
                              style={{ textAlign: "center", marginTop: "20px" }}
                            >
                              *Please note that money added to the wallet is not
                              refundable.
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
                {/* View Model end*/}
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal}
                  className="adding-address"
                  contentLabel="Add Address"
                  scrollable={true}
                >
                  <OrderPopup order_detail={this.state.order_detail} />{" "}
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(wallet);
