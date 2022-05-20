import React, { Component } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { DynamicUrl } from "../../common";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default class viewinventory extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      modalIsOpen: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      status: true,
      customer_name: "",
      email: "",
      mobile_no: "",
      total_amount: "",
      created_date: new Date(),
      updatePaymentId: "",
      updatePaymentAdmin_id: "",
      updatePaymentMethodValue: "",
      paymentUpdateDate: "",
      paymentUpdateNote: "",
      order_status: "",
      order_status_show: "pending",
      orderdata: [],
      allsingledata: "",
      category: [],
      activ_supplier: [],
      allAdmins: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      count: 0,
      skip: 0,
      limit: 20,
      currentPage: 1,
      viewing: false,
      inventory_view: false,
      inventory_data: [],
      search_suppliername: "",
      search_admin_name: "",
    };

    this.openModal = this.openModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.downloadbill = this.downloadbill.bind(this);
  }

  downloadbill(ev) {
    let requestData = {
      inventory_id: ev._id,
    };
    AdminApiRequest(requestData, "/admin/generate/supplier_bill", "POST")
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
  }
  search = (skipParam) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      date: this.state.search_date,
      InvoiceNumber: this.state.search_invoice_number,
      admin: this.state.search_admin_name.value,
      supplier: this.state.search_suppliername.value,
      payment_status: this.state.payment_status,
    };

    AdminApiRequest(requestData, "/admin/getInventory", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
            currentPage: 1,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  reset = () => {
    this.getinventory();
    this.setState({
      search_date: "",
      payment_status: "",
      search_suppliername: "",
      search_invoice_number: "",
      search_admin_name: "",
      currentPage: 1,
    });
  };

  viewcloseModal() {
    this.setState({ show: false, mdl_layout__obfuscator_hide: false });
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
      date: this.state.search_date,
      InvoiceNumber: this.state.search_invoice_number,
      admin: this.state.search_admin_name,
    };

    AdminApiRequest(requestData, "/admin/getInventory", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
            currentPage: pageNumber,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({
          loading: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  backtoproducts = () => {
    this.setState({
      viewing: false,
    });
  };
  backtoproduct = () => {
    this.setState({
      viewing: false,
      inventory_view: false,
    });
  };
  _handleProduct(item) {}

  handlecolor() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!this.state.color) {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "Please Select Color";
    } else {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "";
    }
    if (!this.state.size) {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "Please Select Size";
    } else {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "";
    }
  }

  minus = (quantity, ide) => {
    if (quantity <= 1) {
    } else {
      this.setState({ [ide]: quantity - 1 });
    }
  };

  plus = (quantity, ide) => {
    this.setState({ [ide]: quantity + 1 });
  };

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }

  selectonchnhe = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  updatestatus = () => {
    var id = this.state.edit_id;
    var status = this.state.order_status;

    if ((id, status)) {
      const requestData = {
        id: id,
        status: status,
      };
      AdminApiRequest(requestData, "/admin/updateOrderStatus", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Order updated Successfully !",
              icon: "success",
              successMode: true,
            }).then((willDelete) => {
              window.location.reload();
            });
            this.setState({
              mdl_layout__obfuscator_hide: false,
              editmodalIsOpen: false,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  viewopenModal(dt) {
    console.log("qwerthdbc", dt);
    this.setState({
      allsingledata: dt,
      show: true,
      mdl_layout__obfuscator_hide: true,
    });
  }

  getinventory = () => {
    this.setState({
      loading: true,
    });
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };

    AdminApiRequest(requestData, "/admin/getInventory", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getadminData() {
    const requestData = {
      user_type: "Admin",
    };
    AdminApiRequest(requestData, "/admin/adminGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let admin = [];
          res.data.data.forEach((item, index) => {
            admin.push({
              name: item.username,
              value: item._id,
            });
          });
          console.log(admin);
          this.setState({
            allAdmins: admin,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getinventory();
    this.getadminData();
    let activesupplier = [];
    AdminApiRequest({}, "/admin/supplier_master", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          activesupplier = res.data.data.filter((item) => item.status === true);
          var aa = [];
          activesupplier.forEach((item, index) => {
            aa.push({
              name: item.name,
              value: item._id,
            });
          });
          this.setState({
            activ_supplier: aa,
          });
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    const data1 = {};
    AdminApiRequest(data1, "/admin/product_category", "GET")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          console.log("testingtesttestingtest", res.data.data);
          this.setState({
            category: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(data1, "/admin/usersGetAll", "POST")
      .then((res) => {
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          console.log("customer_data_customer_data", res.data);
          this.setState({
            customer_data: res.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  openPaymentModal = (id, adminId) => {
    this.setState({
      paymentModal: true,
      updatePaymentId: id,
      updatePaymentAdmin_id: adminId,
      // updatePaymentMethodValue,
    });
  };
  updatePaymentByAdmin = async () => {
    if (this.state.updatePaymentMethodValue && this.state.paymentUpdateDate) {
      const requestData = {
        inventory_id: this.state.updatePaymentId,
        adminID: this.state.updatePaymentAdmin_id,
        paymentMethod: this.state.updatePaymentMethodValue,
        paymentDate: this.state.paymentUpdateDate,
        note: this.state.paymentUpdateNote,
      };
      AdminApiRequest(
        requestData,
        "/admin/updateInventoryPaymentByAdmin",
        "POST"
      )
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            swal({
              title: "",
              text: "Payment Updated Successfully",
              icon: "success",
            });
            this.setState({
              paymentModal: false,
              updatePaymentId: "",
              updatePaymentAdmin_id: "",
              updatePaymentMethodValue: "",
            });
          }
        })
        .then(() => {
          this.getinventory();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!this.state.updatePaymentMethodValue) {
        document.querySelector(".err_payment_status").innerHTML =
          "Please Select Payment Method";
      }
      if (!this.state.paymentUpdateDate) {
        document.querySelector(".err_paymentUpdateDate").innerHTML =
          "Please Select Date";
      }
    }
  };
  render() {
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            {this.state.viewing === false ? (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title">Bill Detail</h4>
                          <Link to="/admin-add-inventory">
                            <button
                              className="btn btn-primary m-r-5 float-right"
                              title="Add Inventory"
                            >
                              <i className="fa fa-plus"></i> Add Bill
                            </button>
                          </Link>
                        </div>
                        <div className="searching-every searching-5-col search-five-field">
                          <span>
                            <input
                              type="date"
                              value={this.state.search_date}
                              name="search_date"
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler}
                              placeholder="Date"
                            ></input>
                          </span>
                          <span>
                            <SelectSearch
                              placeholder={
                                this.state.activ_supplier &&
                                this.state.activ_supplier.length > 0
                                  ? "Supplier name"
                                  : "Loading..."
                              }
                              name="search_suppliername"
                              options={this.state.activ_supplier}
                              onChange={(e) => {
                                this.setState({
                                  search_suppliername: e,
                                });
                              }}
                              value={this.state.search_suppliername.value}
                              className="select-search"
                            />
                          </span>
                          <span>
                            <input
                              type="text"
                              value={this.state.search_invoice_number}
                              name="search_invoice_number"
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler}
                              placeholder="Bill Number"
                            ></input>
                          </span>
                          <span>
                            <select
                              name="payment_status"
                              className="form-control"
                              value={this.state.payment_status}
                              onChange={this.formHandler}
                            >
                              <option value="">Select Payment Status</option>
                              <option value="pending">Pending</option>
                              <option value="due">Due</option>
                              <option value="Over Due">Over Due</option>
                              <option value="Complete">Complete</option>
                            </select>
                          </span>
                          <span>
                            <SelectSearch
                              placeholder={
                                this.state.allAdmins &&
                                this.state.allAdmins.length > 0
                                  ? "Admin name"
                                  : "Loading..."
                              }
                              name="search_admin_name"
                              options={this.state.allAdmins}
                              onChange={(e) => {
                                this.setState({
                                  search_admin_name: e,
                                });
                              }}
                              value={this.state.search_admin_name.value}
                              className="select-search"
                            />
                          </span>
                          <span className="search-btn-every">
                            <button
                              type="submit"
                              onClick={() => this.search()}
                              className="btn btn-primary m-r-5"
                            >
                              Search
                            </button>
                            <button
                              onClick={() => this.reset()}
                              className="btn btn-primary m-r-5"
                            >
                              Reset
                            </button>
                          </span>
                        </div>

                        <div className="table-responsive">
                          <table
                            id="datatables"
                            className="table table-striped table-no-bordered table-hover"
                            cellSpacing="0"
                            width="100%"
                          >
                            <thead>
                              <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Supplier Name</th>
                                <th scope="col">Bill Number</th>
                                <th scope="col">Bill KC Number</th>
                                <th scope="col">Bill Amount</th>
                                <th scope="col">Admin Name</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Payment Method</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.viewproduct &&
                              this.state.viewproduct.length > 0 ? (
                                this.state.viewproduct.map((item, Index) => (
                                  <tr>
                                    <td>
                                      <Moment format="DD/MM/YYYY hh:mm:ss A">
                                        {item.created_at}
                                      </Moment>
                                    </td>
                                    <td>{item.supplier_id?.name}</td>
                                    <td>{item.InvoiceNumber}</td>
                                    <td>{item.billNo}</td>
                                    <td>{item.InvoiceAmount}</td>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {item.admin_id && item.admin_id.username
                                        ? item.admin_id.username
                                        : ""}
                                    </td>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {item.paymentStatus}
                                    </td>
                                    <td style={{ textTransform: "capitalize" }}>
                                      {item.paymentMethod
                                        ? item.paymentMethod
                                        : ""}
                                    </td>
                                    <td>
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        title="View"
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          item
                                        )}
                                      ></i>
                                      <Link to={"/edit-inventory/" + item._id}>
                                        <i
                                          className="fa fa-pencil-square-o m-r-5"
                                          title="Edit"
                                        ></i>
                                      </Link>
                                      <i
                                        onClick={this.downloadbill.bind(
                                          this,
                                          item
                                        )}
                                        className="fa fa-print"
                                        aria-hidden="true"
                                      ></i>
                                      {item.paymentStatus
                                        .toLowerCase()
                                        .includes("complete") ? (
                                        ""
                                      ) : (
                                        <p
                                          className="fa fa-update hover-with-cursor m-r-5"
                                          title="Update Payment"
                                          onClick={() =>
                                            this.openPaymentModal(
                                              item._id,
                                              typeof item.admin_id === "object"
                                                ? item.admin_id._id
                                                : item.admin_id
                                            )
                                          }
                                        >
                                          Update Payment
                                        </p>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              ) : this.state.loading ? (
                                <tr>
                                  <td colSpan="9">
                                    <ReactLoading
                                      type={"cylon"}
                                      color={"#febc15"}
                                      height={"60px"}
                                      width={"60px"}
                                      className="m-auto"
                                    />
                                  </td>
                                </tr>
                              ) : (
                                <tr>
                                  <td
                                    colSpan="8"
                                    style={{ textAlign: "center" }}
                                  >
                                    No Data Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.count > 0 ? (
                  <Pagination
                    hideNavigation
                    activePage={this.state.currentPage}
                    itemsCountPerPage={this.state.limit}
                    totalItemsCount={this.state.count}
                    onChange={this.handlePageChange}
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">inventory_2</i>
                        </div>
                      </div>

                      <div className="card-body">
                        <h4 className="card-title"> View Inventory </h4>

                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={() => this.backtoproducts()}
                        >
                          <i
                            style={{ color: "white" }}
                            className="material-icons"
                          >
                            arrow_back_ios
                          </i>{" "}
                          View Inventory
                        </button>
                        <div className="view-box view_inventory_li">
                          <div>
                            <span className="view-title">Bill Number</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceNumber
                                ? this.state.allsingledata.InvoiceNumber
                                : ""}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Bill Date</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceDate ? (
                                <Moment format="DD/MM/YYYY hh:mm:ss A">
                                  {this.state.allsingledata.InvoiceDate}
                                </Moment>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Bill Due Date</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceDueDate ? (
                                <Moment format="DD/MM/YYYY hh:mm:ss A">
                                  {this.state.allsingledata.InvoiceDueDate}
                                </Moment>
                              ) : (
                                ""
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Bill Amount</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceAmount
                                ? this.state.allsingledata.InvoiceAmount
                                : ""}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Supplier Name</span>
                            <span className="view-status">
                              {this.state.allsingledata.supplier_id.name
                                ? this.state.allsingledata.supplier_id.name
                                : ""}
                            </span>
                          </div>

                          <div>
                            <span className="view-title">Date</span>
                            <span className="view-status">
                              <Moment format="DD/MM/YYYY hh:mm:ss A">
                                {this.state.allsingledata.created_at}
                              </Moment>
                            </span>
                          </div>
                          {this.state.allsingledata.productData &&
                          this.state.allsingledata.productData.length > 0 &&
                          this.state.allsingledata ? (
                            this.state.allsingledata.productData.map(
                              (item1, Index) => (
                                <div className="main_card">
                                  <h4>{item1.InvoiceNumber}</h4>
                                  {item1.simpleData &&
                                  item1.simpleData.length > 0
                                    ? item1.simpleData.map((dta, ind) => (
                                        <div className="main_card">
                                          <h4>
                                            Region Name{" "}
                                            <span>{dta.region.name}</span>
                                          </h4>

                                          <p>
                                            {" "}
                                            <span>Quantity</span>
                                            <span>{dta.quantity}</span>
                                          </p>
                                          <p>
                                            {" "}
                                            <span>Cost Price</span>
                                            <span>{dta.costPrice}</span>
                                          </p>
                                        </div>
                                      ))
                                    : ""}
                                </div>
                              )
                            )
                          ) : (
                            <span style={{ color: "red" }}>
                              No item Ordered Yet
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View Model */}

          <div
            className={
              this.state.show
                ? "view-section show modified-section"
                : "view-section hide"
            }
          >
            <button
              type="button"
              className="close"
              onClick={this.viewcloseModal}
            >
              &times;
            </button>
            <h4 className="modal-title">View Details </h4>
            <div className="view-box">
              <ul>
                <li>
                  <span className="view-title">Date</span>
                  <span className="view-status">
                    <Moment format="DD/MM/YYYY hh:mm:ss A">
                      {this.state.allsingledata.created_at}
                    </Moment>
                  </span>
                </li>
                <li>
                  <span className="view-title">Admin Name</span>
                  <span className="view-status">
                    {this.state.allsingledata
                      ? this.state.allsingledata.admin_id &&
                        this.state.allsingledata.admin_id.username
                        ? this.state.allsingledata.admin_id.username
                        : ""
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Bill Number</span>
                  <span className="view-status">
                    {this.state.allsingledata.InvoiceNumber
                      ? this.state.allsingledata.InvoiceNumber
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Bill Amount</span>
                  <span className="view-status">
                    {this.state.allsingledata.InvoiceAmount
                      ? this.state.allsingledata.InvoiceAmount
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Payment Status</span>
                  <span className="view-status">
                    {this.state.allsingledata.paymentStatus
                      ? this.state.allsingledata.paymentStatus
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Added IP Address</span>
                  <span className="view-status">
                    {this.state.allsingledata.updateByIP
                      ? this.state.allsingledata.updateByIP
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Updated IP Address</span>
                  <span className="view-status">
                    {this.state.allsingledata.addedByIP
                      ? this.state.allsingledata.addedByIP
                      : ""}
                  </span>
                </li>
                {this.state.allsingledata.paymentStatus === "Complete" ? (
                  <>
                    <li>
                      <span className="view-title">Payment Date</span>
                      <span className="view-status">
                        {this.state.allsingledata.paymentDate ? (
                          <Moment format="DD/MM/YYYY hh:mm:ss A">
                            {this.state.allsingledata.paymentDate}
                          </Moment>
                        ) : (
                          ""
                        )}
                      </span>
                    </li>
                    <li>
                      <span className="view-title">Payment Note</span>
                      <span className="view-status">
                        {this.state.allsingledata.note
                          ? this.state.allsingledata.note
                          : ""}
                      </span>
                    </li>
                  </>
                ) : (
                  ""
                )}
                {this.state.allsingledata.inventoryItems &&
                  this.state.allsingledata.inventoryItems.map((ittm, indd) => (
                    <div className="latest_product_combine">
                      <li>
                        <span className="view-title">Product Name</span>
                        <span className="view-status">
                          {ittm ? ittm.product_name : ""}
                        </span>
                      </li>
                      {/* <li>
                        <span className="view-title">Cost Price</span>
                        <span className="view-status">
                          {ittm ? ittm.product_costPrice : ""}
                        </span>
                      </li> */}
                      {/* <li>
                        <span className="view-title">Expiration Date</span>
                        <span className="view-status">
                          {ittm.product_expiry ? (
                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                              {ittm.product_expiry}
                            </Moment>
                          ) : (
                            "--"
                          )}
                        </span>
                      </li> */}
                      {console.log("our_product_data", ittm)}
                      {ittm && ittm.configurableData?.length > 0 ? (
                        <table>
                          <tr>
                            <th>Region</th>
                            <th>Variant Name</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            {/* <th>Expiration Date</th> */}
                          </tr>
                          {ittm
                            ? ittm.configurableData.map((item, index) => (
                                <>
                                  <tbody>
                                    <tr>
                                      <td> {item.region.name}</td>
                                      <td> {item.variant_name}</td>
                                      <td> {+item.quantity}</td>
                                      {/* <td>
                                      {" "}
                                      {item.costPrice ? item.costPrice : 0}
                                    </td> */}
                                      <td>
                                        {" "}
                                        {+item.quantity &&
                                        ittm.product_costPrice
                                          ? +item.quantity *
                                            ittm.product_costPrice
                                          : 0}
                                      </td>
                                      {/* <td>
                                          {" "}
                                          {item.ExpirationDate ? (
                                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                                              {item.ExpirationDate}
                                            </Moment>
                                          ) : (
                                            "--"
                                          )}
                                        </td> */}
                                    </tr>
                                  </tbody>
                                </>
                              ))
                            : ""}
                        </table>
                      ) : (
                        <></>
                      )}
                      {/* {ittm.product_region && ittm.product_region.length > 0 ? ( */}
                      <table>
                        <tr>
                          <th>Region</th>
                          <th>Quantity</th>
                          <th>Cost Price</th>
                          <th>Total</th>
                          {/* <th>Expiration Date</th> */}
                        </tr>
                        {/* {ittm
                            ? ittm.product_region.map((item, index) => ( */}
                        <>
                          <tbody>
                            <tr>
                              <td> {ittm.region?.name}</td>
                              <td> {+ittm.productQuantity}</td>
                              <td>
                                {" "}
                                {ittm.product_costPrice
                                  ? ittm.product_costPrice
                                  : 0}
                              </td>
                              <td>
                                {" "}
                                {+ittm.productQuantity && ittm.product_costPrice
                                  ? +ittm.productQuantity *
                                    ittm.product_costPrice
                                  : 0}
                              </td>
                              {/* 
                                <td>
                                  {" "}
                                  {item.ExpirationDate ? (
                                    <Moment format="DD/MM/YYYY hh:mm:ss A">
                                      {item.ExpirationDate}
                                    </Moment>
                                  ) : (
                                    "--"
                                  )}
                                </td> 
                              */}
                            </tr>
                          </tbody>
                        </>
                        {/* ))
                            : ""} */}
                      </table>
                      {/* // ) : (
                      //   <></>
                      // )} */}
                    </div>
                  ))}
              </ul>
            </div>
          </div>
          {/* End View modal */}
          <Modal
            isOpen={this.state.paymentModal}
            onRequestClose={() =>
              this.setState({
                paymentModal: false,
                paymentUpdateDate: "",
                updatePaymentMethodValue: "",
                paymentUpdateNote: "",
              })
            }
            // className="adding-address"
            style={customStyles}
            // contentLabel="Example Modal"
          >
            <div role="dialog driver_oreder">
              <div className="modal-dialog driver_order_detail">
                <div className="modal-content">
                  <button
                    type="button"
                    className="close"
                    onClick={this.editcloseModal}
                  >
                    &times;
                  </button>
                  <h4 className="modal-title">Update Payment</h4>
                  <div className="modal-form-bx">
                    <div className="view-box">
                      {" "}
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Payment Date</label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="date"
                            value={this.state.paymentUpdateDate}
                            name="paymentUpdateDate"
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler}
                            placeholder="Date"
                          ></input>
                          <div
                            className="err err_paymentUpdateDate"
                            style={{ margin: "10px 0px" }}
                          ></div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Payment Method</label>
                        </div>
                        <div className="modal-right-bx">
                          <select
                            name="updatePaymentMethodValue"
                            id=""
                            style={{
                              width: "80%",
                              height: "40px",
                              borderTop: "none",
                              borderRight: "none",
                              borderBottom: "2px solid rgb(254, 188, 21)",
                              borderLeft: "none",
                              borderImage: "initial",
                            }}
                            onChange={(e) =>
                              this.setState({
                                updatePaymentMethodValue: e.target.value,
                              })
                            }
                          >
                            <option value="">Select Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Paytm">Paytm</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      className="err err_payment_status"
                      style={{ margin: "10px 0px" }}
                    ></div>
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Note</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="text"
                          value={this.state.paymentUpdateNote}
                          name="paymentUpdateNote"
                          className="form-control"
                          autoComplete="off"
                          onChange={this.formHandler}
                          placeholder="Enter Note.."
                        ></input>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => this.updatePaymentByAdmin()}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <div
            onClick={this.viewcloseModal}
            className={
              this.state.mdl_layout__obfuscator_hide
                ? "mdl_layout__obfuscator_show"
                : "mdl_layout__obfuscator_hide"
            }
          ></div>

          <Adminfooter />
        </div>
      </div>
    );
  }
}
