import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import swal from "sweetalert";
import { AdminApiRequest } from "../../../apiServices/AdminApiRequest";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
    overflow: "unset",
  },
};
export default class Delivery extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      loading: true,
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      priority: "",
      priorityStatus: true,
      error: false,
      reason: "",
      point: null,
      activePage: 1,
      mdl_layout__obfuscator_hide: false,
      selectedUser: "",
      viewOpen: false,
      allUsers: [],
      viewData: [],
      skip: 0,
      count: 1,
      limit: 20,
      currentPage: 1,
      status_search: "",
      user_name_search: "",
      user_point_search: "",
      loading: true,
    };
    this.formHandler1 = this.formHandler1.bind(this);
  }
  async handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.setState({ loading: true });
    this._get_loyality(skip);
  }

  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
    this.setState({ filter_id: "", filterCat_name: "" });
  }

  importDelivery() {
    var requestData = {};
    AdminApiRequest(requestData, "/pincode/CSVGet", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          //
          const newWindow = window.open(
            res.data.data,
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
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  _get_loyality(skip) {
    this.setState({ loading: true });
    var requestData = {
      skip: skip || 0,
      limit: 20,
    };
    AdminApiRequest(requestData, "/pincode/all", "POST")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
            loading: false,
          });
          if (res.data.data.length > 0) {
            this.setState({ noDataStatus: false });
          } else {
            this.setState({ noDataStatus: true });
          }
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }
  _handleSubmit() {
    if (this.state.csv_add) {
      this._create_loyality();
      this.setState({ error: false });
    } else {
      this.setState({
        error: true,
      });
    }
  }

  async _create_loyality() {
    this.setState({ loading: true });
    var data = new FormData();
    var sheet = document.querySelector('input[name="csv_add"]').files[0];
    data.append("sheet", sheet);

    await AdminApiRequest(data, "/pincode/add", "POST", "apiWithImage")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          swal({
            title: "Success",
            text: "Record Saved Successfully !",
            icon: "success",
            successMode: true,
          });
          this._get_loyality();
          this.closeModal();
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }
  openModal(openFor, val) {
    if (openFor === "add") {
      this.setState({
        modalIsOpen: true,
        faqId: "",
        faqCategory: "",
        question: "",
        answer: "",
        priority: "",
      });
    } else if (openFor === "view") {
      this.setState({
        show: true,
        viewData: val,
      });
    }
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      editFAQ: false,
    });
    this.setState({
      selectedUser: "",
    });
  }

  //search
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  componentDidMount() {
    this._get_loyality();
  }
  render() {
    return (
      <div>
        {this.state.show ? (
          <></>
        ) : (
          <div className="wrapper ">
            <Adminsiderbar />

            <div className="main-panel">
              <Adminheader />

              <div className="content">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12 ml-auto mr-auto">
                      <div className="card">
                        <div className="card-header card-header-primary card-header-icon">
                          <div className="card-icon">
                            <i className="material-icons">slideshow</i>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="manage_up_add_btn">
                            <h4 className="card-title"> Delivery</h4>
                          </div>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            title="Import"
                            onClick={() => this.importDelivery()}
                          >
                            Export
                          </button>
                          <a onClick={() => this.openModal("add")}>
                            <button
                              className="btn btn-primary m-r-5 float-right"
                              title="Add Inventory"
                            >
                              Import
                            </button>
                          </a>
                          {/* <div className="searching-every searching-4-col popup-arrow-select">
                            <span>
                              <input
                                type="date"
                                name="date_search"
                                className="form-control"
                                autoComplete="off"
                                onChange={this.formHandler1}
                                value={this.state.date_search}
                                placeholder="Date"
                              ></input>
                            </span>
                            <span>
                              <select
                                name="status_search"
                                value={this.state.status_search}
                                className="form-control"
                                onChange={this.formHandler1}
                                style={{ maxheight: 130 }}
                              >
                                <option value="">Select Status</option>
                                <option value="Added">Credit</option>
                                <option value="Redeemed">Debit</option>
                              </select>
                            </span>
                            <span>
                              <SelectSearch
                                placeholder={"UserName"}
                                options={this.state.allUsers}
                                onChange={(e) => {
                                  this.setState({ selectedUser: e });
                                }}
                                value={this.state.selectedUser.value}
                                className="select-search"
                                name="user"
                              />
                            </span>

                            <span className="search-btn-every">
                              <button
                                type="submit"
                                onClick={() => this.getcustomerfilter()}
                                className="btn btn-primary m-r-5"
                              >
                                Search
                              </button>
                              <button
                                onClick={() => this.resetFilters()}
                                className="btn btn-primary m-r-5"
                              >
                                Reset
                              </button>
                            </span>
                          </div> */}

                          <div className="table-responsive">
                            <table
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  {/* <th scope="col">Date</th> */}
                                  <th scope="col">Pincode</th>
                                  <th scope="col">Region</th>
                                  <th scope="col">Region ID</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Message</th>
                                  <th scope="col">COD</th>
                                  {/* <th scope="col">Delivery Charges</th> */}
                                  <th scope="col">MOQ</th>
                                  <th scope="col">Free Delivery</th>
                                  <th scope="col">Farm pick up</th>
                                  <th scope="col">
                                    Next day delivery <br />{" "}
                                    <small>2pm-8pm</small>
                                  </th>
                                  <th scope="col">
                                    Next day delivery <br />{" "}
                                    <small>8am-2pm</small>
                                  </th>
                                  <th scope="col">
                                    Next day delivery Standard <br />{" "}
                                    <small>9am-9pm</small>
                                  </th>
                                  <th scope="col">
                                    Same day delivery <br />{" "}
                                    <small>till 2pm</small>
                                  </th>
                                  <th scope="col">
                                    Standard delivery <br />{" "}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.data && this.state.data[0] ? (
                                  this.state.data.map((data, Index) => {
                                    return (
                                      <tr>
                                        {/* <td>
                                          {
                                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                                              {data.created_at}
                                            </Moment>
                                          }
                                        </td> */}
                                        <td>{data.Pincode}</td>
                                        <td>
                                          {data.Region_ID
                                            ? data.Region_ID.name
                                            : ""}
                                        </td>
                                        <td>
                                          {data.Region_ID
                                            ? data.Region_ID._id
                                            : ""}
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {data.status}
                                        </td>
                                        <td className="text-center">
                                          {data.Message ? (
                                            <i
                                              className="fa fa-eye hover-with-cursor m-r-5"
                                              title={data.Message}
                                            ></i>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.COD} ₹
                                            {data.COD_Charges || "0"}
                                          </div>
                                        </td>
                                        {/* <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Delivery_Charges}
                                          </div>
                                        </td> */}
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.MOQ} ₹
                                            {data.MOQ_Charges || "0"}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Free_Shipping} ₹
                                            {data.Free_Shipping_amount || "0"}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Farm_pick_up +
                                              " ₹" +
                                              (data.Farm_pick_up_delivery_charges
                                                ? data.Farm_pick_up_delivery_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Next_day_delivery_2pm_8pm +
                                              " ₹" +
                                              (data.Next_day_delivery_2pm_8pm_charges
                                                ? data.Next_day_delivery_2pm_8pm_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Next_day_delivery_8am_2pm +
                                              " ₹" +
                                              (data.Next_day_delivery_8am_2pm_charges
                                                ? data.Next_day_delivery_8am_2pm_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Next_day_delivery_Standard_9am_9pm +
                                              " ₹" +
                                              (data.Next_day_delivery_Standard_9am_9pm_charges
                                                ? data.Next_day_delivery_Standard_9am_9pm_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Same_day_delivery_till_2pm +
                                              " ₹" +
                                              (data.Same_day_delivery_till_2pm_charges
                                                ? data.Same_day_delivery_till_2pm_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {" "}
                                          <div className="lineWrap">
                                            {data.Standard_delivery +
                                              " ₹" +
                                              (data.Standard_delivery_charges
                                                ? data.Standard_delivery_charges
                                                : "0")}
                                          </div>
                                        </td>
                                        {/* <td>
                                            <i
                                              className="fa fa-eye hover-with-cursor m-r-5"
                                              title="View"
                                              onClick={this.viewopenModal.bind(
                                                this,
                                                data
                                              )}
                                            ></i>
                                          </td> */}
                                      </tr>
                                    );
                                  })
                                ) : this.state.loading ? (
                                  <tr>
                                    <td
                                      colSpan="10"
                                      style={{ textAlign: "center" }}
                                    >
                                      <i
                                        className="fa fa-spinner searchLoading"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  </tr>
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="10"
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
                    <Pagination
                      hideNavigation
                      activePage={this.state.currentPage}
                      itemsCountPerPage={this.state.limit}
                      totalItemsCount={this.state.count}
                      onChange={this.handlePageChange.bind(this)}
                    />
                  </div>
                </div>
                {/* Filter popup */}

                {/* Add model here */}
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={() => this.closeModal()}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog add-loyality-block-pop">
                      <div className="modal-content">
                        <button
                          type="button"
                          className="close"
                          onClick={() => this.closeModal()}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">IMPORT</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Add File
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="csv_add"
                                  value={this.state.csv_add}
                                  className="form-control"
                                  placeholder="Point"
                                  onChange={(val) => this.formHandler(val)}
                                />
                              </div>
                            </div>
                            {this.state.error ? (
                              <div style={{ alignItems: "center" }}>
                                <span className="err err_csv_add">
                                  Please add File.
                                </span>
                              </div>
                            ) : (
                              ""
                            )}
                            <div
                              className="modal-bottom"
                              style={{ marginTop: 30 }}
                            >
                              <button
                                type="button"
                                className="btn btn-primary feel-btn"
                                onClick={() => this._handleSubmit()}
                              >
                                Add
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="admin-header">
              <Adminfooter />
            </div>
          </div>
        )}
      </div>
    );
  }
}
