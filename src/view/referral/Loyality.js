import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Moment from "react-moment";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
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
    transform: "translate(-50%,-50%)",
    overflow: "unset",
  },
};
export default class Loyality extends Component {
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
    };
    this.formHandler1 = this.formHandler1.bind(this);
  }
  async handlePageChange(pageNumber) {
    // console.log(`active page is ${pageNumber}`);
    this.setState({
      mdl_layout__obfuscator_hide: true,
      loading: true,
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.setState({ loading: true });
    var requestData = {
      skip: skip,
      limit: this.state.limit,
      user_id: this.state.selectedUser.value,
      reason: this.state.reason,
      point: this.state.point,
      pointStatus: this.state.action,
    };
    AdminApiRequest(
      requestData,
      "/admin/loyality/LoyalityHistoryOfAllUser",
      "POST"
    )
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
            loading: false,
            mdl_layout__obfuscator_hide: false,
          });
          if (res.data.length > 0) {
            this.setState({ noDataStatus: false });
          } else {
            this.setState({ noDataStatus: true });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }

  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
    this.setState({ filter_id: "", filterCat_name: "" });
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

  getcustomer() {
    AdminApiRequest({}, "/admin/usersGetAllActive", "GET")
      .then((res) => {
        let localUser = [];
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((dt) => {
            localUser.push({
              name: dt.name + " " + dt.contactNumber,
              value: dt._id,
            });
          });
          this.setState({
            allUsers: localUser,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  _get_loyality() {
    this.setState({ loading: true });
    var requestData = {
      skip: this.state.activePage === 1 ? 0 : this.state.skip,
      limit: 20,
    };
    AdminApiRequest(
      requestData,
      "/admin/loyality/LoyalityHistoryOfAllUser",
      "POST"
    )
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
            loading: false,
          });
          if (res.data.length > 0) {
            this.setState({ noDataStatus: false });
          } else {
            this.setState({ noDataStatus: true });
          }
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  _create_loyality() {
    this.setState({ loading: true });
    var data = {
      adminID: localStorage.getItem("adminInfo")
        ? JSON.parse(localStorage.getItem("adminInfo"))._id
        : "",
      user_id: this.state.selectedUser.value,
      reason: this.state.reason,
      point: this.state.point,
      pointStatus: this.state.action,
    };

    AdminApiRequest(data, "/admin/loyality/AddPointsToUser", "POST", "")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          swal({
            title: "Success",
            text: "Record Saved Successfully !",
            icon: "success",
            successMode: true,
          });
          this.setState({
            loading: false,
            adminID: "",
            user_id: "",
            reason: "",
            point: "",
            pointStatus: "",
            modalIsOpen: false,
          });
          this._get_loyality();
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  }

  //search
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  getcustomerfilter = () => {
    this.setState({ loading: true });
    let requestData = {
      skip: this.state.activePage === 1 ? 0 : this.state.skip,
      limit: 20,
      pointStatus: this.state.status_search,
      user_id: this.state.selectedUser.value,
      // point: this.state.user_point_search,
      date: this.state.date_search,
    };
    AdminApiRequest(
      requestData,
      "/admin/loyality/LoyalityHistoryOfAllUser",
      "POST"
    )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.message === "ok") {
            this.setState({
              data: res.data.data,
              count: res.data.count,
              loading: false,
            });
          }

          if (res.data.count === 0) {
            this.setState({ noDataStatus: false });
          } else {
            this.setState({ noDataStatus: true });
          }
        } else {
          swal({
            // title: "Network Issue",
            text: res.data.message,
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((err) => (console.log(err), this.setState({ loading: false })));
  };
  resetFilters() {
    this._get_loyality();
    this.setState({
      status_search: "",
      user_name_search: "",
      user_point_search: "",
      date_search: "",
      selectedUser: "",
    });
  }
  _handleSubmit() {
    if (
      this.state.selectedUser &&
      this.state.reason &&
      this.state.point &&
      !isNaN(this.state.point) &&
      this.state.point > 0 &&
      this.state.action
    ) {
      this._create_loyality();
      this.setState({ submitErr: "", submitStatus: true });
      this.setState({
        selectedUser: "",
      });
    } else {
      this.setState({
        submitErr:
          this.state.point > 0
            ? "* Complete required fields"
            : "Points should be greater than 0",
        submitStatus: false,
      });
    }
  }
  componentDidMount() {
    this._get_loyality();
    this.getcustomer();
  }

  async viewopenModal(val) {
    this.setState({
      viewOpen: true,
      mdl_layout__obfuscator_hide: true,
      viewData: await val,
    });
  }

  viewcloseModal() {
    console.log(" close =>");
    this.setState({
      viewOpen: false,
      mdl_layout__obfuscator_hide: false,
    });
  }
  render() {
    console.log(this.state.viewData);
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
                            <h4 className="card-title"> Loyalty</h4>
                            <a onClick={() => this.openModal("add")}>
                              <button
                                className="btn btn-primary m-r-5 float-right"
                                title="Add Inventory"
                              >
                                <i className="fa fa-plus"></i> Add Loyalty
                              </button>
                            </a>
                          </div>
                          <div className="searching-every searching-4-col popup-arrow-select">
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
                          </div>

                          <div className="table-responsive">
                            <table
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">Date</th>
                                  <th scope="col">Add/Redeemed</th>
                                  <th scope="col">Customer Name</th>
                                  <th scope="col">Loyalty Point</th>
                                  <th scope="col">Detail</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.data && this.state.data[0] ? (
                                  this.state.data.map((data, Index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {
                                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                                              {data.created_at}
                                            </Moment>
                                          }
                                        </td>
                                        <td>
                                          {data.pointStatus === "Added" ||
                                          data.pointStatus === "Added"
                                            ? "Added"
                                            : "Redeemed"}
                                        </td>
                                        <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.user_id
                                              ? data.user_id.name
                                              : ""}
                                          </div>
                                        </td>
                                        <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.point.toFixed(2)}
                                          </div>
                                        </td>
                                        <td>
                                          {" "}
                                          <div className="lineWrap">
                                            {data.reason
                                              ? data.reason
                                              : data.resion && data.resion}
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
                                      colSpan="5"
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
                                      colSpan="5"
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
                        <h4 className="modal-title">Add Loyalty</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Add/Redeem
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="pointStatus"
                                  id=""
                                  value={this.state.action}
                                  onChange={(e) =>
                                    this.setState({ action: e.target.value })
                                  }
                                >
                                  <option value="">Select</option>
                                  <option value="Added">Add</option>
                                  <option value="Redeemed">Redeem</option>
                                </select>
                                <span className="err err_name">
                                  {this.state.answerStatus
                                    ? ""
                                    : this.state.answerErr}
                                </span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Customer Name
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <SelectSearch
                                  placeholder={"Search or Select Customer"}
                                  options={this.state.allUsers}
                                  onChange={(e) => {
                                    this.setState({ selectedUser: e });
                                  }}
                                  value={this.state.selectedUser.value}
                                  className="select-search"
                                  name="user"
                                />
                                <span className="err err_name">
                                  {this.state.answerStatus
                                    ? ""
                                    : this.state.answerErr}
                                </span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Loyalty Point
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="number"
                                  name="point"
                                  value={this.state.point}
                                  className="form-control"
                                  placeholder="Point"
                                  onChange={(val) =>
                                    this.formHandler(val, "point")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.answerStatus
                                    ? ""
                                    : this.state.answerErr}
                                </span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Reason
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <textarea
                                  type="textarea"
                                  name="reason"
                                  value={this.state.reason}
                                  className="form-control"
                                  placeholder="Enter Detail"
                                  onChange={(val) =>
                                    this.formHandler(val, "reason")
                                  }
                                />
                                <span className="err err_name">
                                  {this.state.questionStatus
                                    ? ""
                                    : this.state.questionErr}
                                </span>
                              </div>
                            </div>

                            <div style={{ alignItems: "center" }}>
                              <span className="err err_name">
                                {this.state.submitStatus
                                  ? ""
                                  : this.state.submitErr}
                              </span>
                            </div>
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
                {/* View Model */}
                <div
                  className={
                    this.state.viewOpen
                      ? "view-section show"
                      : "view-section hide"
                  }
                >
                  <button
                    type="button"
                    className="close"
                    // onClick={() => this.viewcloseModal()}
                  >
                    &times;
                  </button>
                  <h4 className="modal-title">View Details </h4>
                  <div className="view-box">
                    <ul>
                      <li>
                        <span className="view-title">Created At</span>
                        <span className="view-status">
                          {
                            <Moment format="DD/MM/YYYY hh:mm:ss A">
                              {this.state.viewData.createDate}
                            </Moment>
                          }
                        </span>
                      </li>
                      <li>
                        <span className="view-title">User Name</span>
                        <span className="view-status">
                          {this.state.viewData.user_id &&
                            this.state.viewData.user_id.name}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Detail</span>
                        <span className="view-status">
                          {this.state.viewData.reason}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Loyalty Percentage</span>
                        <span className="view-status">
                          {this.state.viewData.loyalityPercentage}
                        </span>
                      </li>

                      <li>
                        <span className="view-title">Point Status</span>
                        <span className="view-status">
                          {this.state.viewData.pointStatus}
                        </span>
                      </li>
                      <li>
                        <span className="view-title">Total Amount</span>
                        <span className="view-status">
                          {this.state.viewData.TotalAmmount}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* End View modal */}

                <div
                  onClick={() => this.viewcloseModal()}
                  className={
                    this.state.mdl_layout__obfuscator_hide
                      ? "mdl_layout__obfuscator_show"
                      : "mdl_layout__obfuscator_hide"
                  }
                >
                  <span style={{ alignItems: "center" }}>
                    <i
                      className="fa fa-spinner searchLoading"
                      aria-hidden="true"
                    ></i>
                  </span>
                </div>
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
