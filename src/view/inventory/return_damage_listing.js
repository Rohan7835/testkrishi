import React, { Component } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import Pagination from "react-js-pagination";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

export default class returnanddamangeinventory extends Component {
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
      order_status: "",
      order_status_show: "pending",
      orderdata: [],
      allsingledata: "",
      category: [],
      product: [],
      customer_data: [],
      dropdownColor: [],
      dropdownSize: [],
      count: 1,
      skip: 0,
      limit: 20,
      currentPage: 1,
      viewing: false,
      inventory_view: false,
      inventory_data: [],
    };

    this.openModal = this.openModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
  }

  search = (skipParam, pageNumber) => {
    const requestData = {
      skip: skipParam ? skipParam : 0,
      limit: this.state.limit,
      voucherType: "return",
      date: this.state.search_date,
      product_name: this.state.search_product,
      admin: this.state.search_admin_name,
    };

    AdminApiRequest(requestData, "/admin/all/voucherInventory", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
            currentPage: pageNumber || 1,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  reset = () => {
    this.returndata();
    this.setState({
      search_date: "",
      search_product: "",
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
    this.search(skip, pageNumber);
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
  _handleProduct(item) {
    var productSelected = {
      data: item,
      quantity: this.state[item._id] ? this.state[item._id] : 1,
    };
  }

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
    this.setState({
      allsingledata: dt,
      // viewing: true,
    });
    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }
  returndata = () => {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
      voucherType: "return",
    };

    AdminApiRequest(requestData, "/admin/all/voucherInventory", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            viewproduct: res.data.data,
            count: res.data.count,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.returndata();
    const data1 = {};
    AdminApiRequest(data1, "/admin/product_category", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
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
        if (res.status === 201 || res.status === 200) {
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
                          <h4 className="card-title">Return Inventory</h4>
                          <Link to="/add-return-damage">
                            <button
                              className="btn btn-primary m-r-5 float-right"
                              title="Add Inventory"
                            >
                              <i className="fa fa-plus"></i> Add Return Product
                            </button>
                          </Link>
                        </div>
                        <div className="searching-every searching-4-col">
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
                            <input
                              type="text"
                              value={this.state.search_product}
                              name="search_product"
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler}
                              placeholder="Product Name"
                            ></input>
                          </span>
                          <span>
                            <input
                              type="text"
                              value={this.state.search_admin_name}
                              name="search_admin_name"
                              className="form-control"
                              autoComplete="off"
                              onChange={this.formHandler}
                              placeholder="Admin Name"
                            ></input>
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
                                <th scope="col">Product Name</th>
                                <th scope="col">Admin Name</th>
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
                                    <td>
                                      {item.product_id
                                        ? item.product_id.product_name
                                        : ""}
                                    </td>
                                    <td>
                                      {item.admin_id &&
                                      item.admin_id.username != null
                                        ? item.admin_id.username
                                        : "-"}
                                    </td>
                                    <td>
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        title={"View"}
                                        onClick={this.viewopenModal.bind(
                                          this,
                                          item
                                        )}
                                      ></i>
                                      {/* <Link to={"/edit-inventory/" + item.InvoiceNumber}>
                                      <i
                                        className="fa fa-pencil-square-o m-r-5"
                                        title="View"
                                      ></i>
                                      </Link> */}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{ textAlign: "center" }}
                                  >
                                    No Data Found.
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
                <Pagination
                  hideNavigation
                  activePage={this.state.currentPage}
                  itemsCountPerPage={this.state.limit}
                  totalItemsCount={this.state.count}
                  onChange={this.handlePageChange}
                />
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
                        <h4 className="card-title"> View Lost & Damage </h4>

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
                          Back
                        </button>
                        <div className="view-box view_inventory_li">
                          <div>
                            <span className="view-title">Invoice Number</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceNumber
                                ? this.state.allsingledata.InvoiceNumber
                                : ""}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Invoice Date</span>
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
                            <span className="view-title">Invoice Due Date</span>
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
                            <span className="view-title">Invoice Amount</span>
                            <span className="view-status">
                              {this.state.allsingledata.InvoiceAmount
                                ? this.state.allsingledata.InvoiceAmount
                                : ""}
                            </span>
                          </div>
                          <div>
                            <span className="view-title">Supplier Name</span>
                            <span className="view-status">
                              {this.state.allsingledata.supplier_id &&
                              this.state.allsingledata.supplier_id.name
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
              this.state.show ? "view-section show" : "view-section hide"
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
                  <span className="view-title">Product Name</span>
                  <span className="view-status">
                    {this.state.allsingledata
                      ? this.state.allsingledata.product_id.product_name
                      : ""}
                  </span>
                </li>
                <li>
                  <span className="view-title">Admin Name</span>
                  <span className="view-status">
                    {this.state.allsingledata
                      ? this.state.allsingledata.admin_id.username
                      : ""}
                  </span>
                </li>
                <h3>Region Wise Entry</h3>
                <table className="re-wise-table-daata">
                  <tr>
                    <th>Region</th>
                    <th>Quantity</th>
                  </tr>
                  {/* {this.state.allsingledata
                    ? this.state.allsingledata.simpleData.map((item, index) => ( */}
                  <>
                    <tbody>
                      <tr>
                        <td> {this.state.allsingledata.regionID?.name}</td>
                        <td> {this.state.allsingledata.TotalQuantity}</td>
                      </tr>
                    </tbody>
                  </>
                  {/* ))
                    : ""} */}
                </table>
              </ul>
            </div>
          </div>
          {/* End View modal */}

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
