import React, { Component } from "react";
import Modal from "react-modal";
import Moment from "react-moment";
import Switch from "react-switch";
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
      var admin = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_id: admin._id,
      loading: true,
      modalIsOpen: false,
      modalIsOpen2: false,
      show: false,
      priorityStatus: true,
      point: null,
      activePage: 1,
      mdl_layout__obfuscator_hide: false,
      viewOpen: false,
      allUsers: [],
      viewData: [],
      editmodalIsOpen: false,
      data: [],
      loading:true,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.edit = this.edit.bind(this);
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ edit_status: true });
    } else {
      this.setState({ edit_status: false });
    }
  }

  edit() {
    var name = this.state.edit_name;
    var level = this.state.edit_level;
    var startOrderNo = this.state.edit_start_order;
    var endOrderNo = this.state.edit_end_order;
    var accumulation = this.state.edit_accumulation;
    var redeem = this.state.edit_redeem_point;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var hitting_api = true;
    if (!name) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!level) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_level");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!startOrderNo) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_start_order");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!endOrderNo) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_end_order");
      valueErr[0].innerText = "This Field is Required";
    }
    //  else if (!isNaN(endOrderNo) || endOrderNo !== "Infinity") {

    //   hitting_api = false;
    //   valueErr = document.getElementsByClassName("err_edit_end_order");
    //   valueErr[0].innerText =
    //     "This field excepts only numeric value or Infinity text";
    // }
    if (!accumulation) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_accumulation");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!redeem) {
      hitting_api = false;
      valueErr = document.getElementsByClassName("err_edit_redeem_point");
      valueErr[0].innerText = "This Field is Required";
    }

    if (hitting_api === true) {
      let requestData = {
        adminID: this.state.admin_id,
        program_id: this.state.edit_id,
        name: this.state.edit_name,
        level: this.state.edit_level,
        startOrderNo: this.state.edit_start_order,
        endOrderNo: this.state.edit_end_order,
        accumulation: this.state.edit_accumulation,
        redeem: this.state.edit_redeem_point,
        status: this.state.edit_status,
      };
      AdminApiRequest(requestData, "/admin/loyality/updateProgram", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this._get_loyality();
            this.setState({
              editmodalIsOpen: false,
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
    }
  }

  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
  }

  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }

  editopenModal(data) {
    this.setState({
      edit_id: data._id,
      edit_name: data.name,
      edit_level: data.level,
      edit_start_order: data.startOrderNo,
      edit_end_order: data.endOrderNo ? data.endOrderNo : "Infinity",
      edit_accumulation: data.accumulation,
      edit_redeem_point: data.redeem,
      edit_status: data.status,
      editmodalIsOpen: true,
    });
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
  }

  _get_loyality() {
    this.setState({ loading: true });
    var requestData = {
      skip: this.state.activePage === 1 ? 0 : this.state.skip,
      limit: 20,
    };
    AdminApiRequest(requestData, "/admin/loyality/getAllPrograms", "POST")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
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

  componentDidMount() {
    this._get_loyality();
  }

  async viewopenModal(val) {
    this.setState({
      viewOpen: true,
      mdl_layout__obfuscator_hide: true,
      viewData: await val,
    });
  }

  viewcloseModal() {
    this.setState({
      viewOpen: false,
      mdl_layout__obfuscator_hide: false,
    });
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
                            <h4 className="card-title"> Loyalty Programme </h4>
                            {/* <a onClick={() => this.openModal("add")}>
                              <button
                                className="btn btn-primary m-r-5 float-right"
                                title="Add Inventory"
                              >
                                <i className="fa fa-plus"></i> Add Loyalty
                                Program
                              </button>
                            </a> */}
                          </div>
                          <div className="table-responsive">
                            <table
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">Name</th>
                                  <th scope="col">Level</th>
                                  <th scope="col">Start Order #</th>
                                  <th scope="col">End Order #</th>
                                  <th scope="col">Accumulation %</th>
                                  <th scope="col">Redeem %</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.data.length > 0 ? (
                                  this.state.data.map((data, Index) => {
                                    return (
                                      <tr>
                                        <td>{data.name}</td>
                                        <td>{data.level}</td>
                                        <td>{data.startOrderNo}</td>
                                        <td>
                                          {data.endOrderNo
                                            ? data.endOrderNo
                                            : "Infinity"}
                                        </td>
                                        <td>{data.accumulation}</td>
                                        <td>{data.redeem}</td>
                                        <td>
                                          {data.status === true
                                            ? "Active"
                                            : "InActive"}
                                        </td>
                                        <td>
                                          {/* <i
                                              className="fa fa-eye hover-with-cursor m-r-5"
                                              title="View"
                                              onClick={this.viewopenModal.bind(
                                                this,
                                                data
                                              )}
                                            ></i> */}
                                          <i
                                            className="fa fa-edit hover-with-cursor m-r-5"
                                            onClick={this.editopenModal.bind(
                                              this,
                                              data
                                            )}
                                          ></i>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td>Loading...</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Filter popup */}
                {/* Edit Modal */}
                <Modal
                  isOpen={this.state.editmodalIsOpen}
                  onRequestClose={this.editcloseModal}
                  style={customStyles}
                >
                  <div role="dialog">
                    <div className="modal-dialog admin_new_user_all">
                      <div className="modal-content default_form_design">
                        <button
                          type="button"
                          className="close"
                          onClick={this.editcloseModal}
                        >
                          &times;
                        </button>
                        <h4 className="modal-title">Edit Loyalty Program</h4>
                        <div className="modal-form-bx">
                          <form>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Name<span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_name"
                                  autoComplete="off"
                                  value={this.state.edit_name}
                                  className="form-control"
                                  placeholder="Enter Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_name"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Level<span className="asterisk">*</span>
                                </label>
                              </div>

                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_level"
                                  autoComplete="off"
                                  value={this.state.edit_level}
                                  className="form-control"
                                  placeholder="Enter Level"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_level"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Start Order Number
                                  <span className="asterisk">*</span>
                                </label>
                              </div>

                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_start_order"
                                  autoComplete="off"
                                  value={this.state.edit_start_order}
                                  className="form-control"
                                  placeholder="Enter Start Order Number"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_start_order"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  End Order Number
                                  <span className="asterisk">*</span>
                                </label>
                              </div>

                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_end_order"
                                  autoComplete="off"
                                  value={this.state.edit_end_order}
                                  className="form-control"
                                  placeholder="Enter End Order Number"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_end_order"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Accumulation Percentage %
                                  <span className="asterisk">*</span>
                                </label>
                              </div>

                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_accumulation"
                                  autoComplete="off"
                                  value={this.state.edit_accumulation}
                                  className="form-control"
                                  placeholder="Enter Accumulation"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_accumulation"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Redeem Percentage %
                                  <span className="asterisk">*</span>
                                </label>
                              </div>

                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_redeem_point"
                                  autoComplete="off"
                                  value={this.state.edit_redeem_point}
                                  className="form-control"
                                  placeholder="Enter Redeem Percentage"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_edit_redeem_point"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Status</label>
                              </div>

                              <div className="modal-right-bx">
                                <Switch
                                  name="edit_status"
                                  onChange={(ev) => this.handleChangeStatus(ev)}
                                  checked={this.state.edit_status}
                                  id="normal-switch"
                                />
                              </div>
                            </div>

                            <div className="modal-bottom">
                              {/* <button className="btn btn-primary feel-btn" onClick={this.editcloseModal}>Cancel</button> */}
                              <button
                                type="button"
                                className="btn btn-primary feel-btn"
                                onClick={this.edit}
                              >
                                Save
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
                        <span className="view-title">Reason</span>
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
                ></div>
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
