import React, { Component } from "react";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
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

export default class User extends Component {
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
      rolesData: [],
      role_id: "",
      userData: [],
      email: "",
      mobile: "",
      password: "",
      username: "",
      status: true,
      user_type: "",
      _id: "",
      loading: true,
      role_selected: "",
      viewData: [],
      user_name_search: "",
      user_mobile_search: "",
      user_email_search: "",
      status_search: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  formHandler(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  handleChangeStatus(checked) {
    this.setState({ status: checked });
  }

  add() {
    var username = this.state.username ? this.state.username : "";
    var email = this.state.email ? this.state.email : "";
    var mobile = this.state.mobile ? this.state.mobile : "";
    var password = this.state.password ? this.state.password : "";
    var role_id = this.state.role_id ? this.state.role_id : "";

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!username) {
      valueErr = document.getElementsByClassName("err_username");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    }
    // eslint-disable-next-line
    var reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = "on";
    if (email && !email.match(reEmail)) {
      validEmail = "off";
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "This Field is Required";
    } else if (mobile.length !== 10) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "Please Enter a Valid number";
    }
    if (!password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!role_id) {
      valueErr = document.getElementsByClassName("err_role_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (
      username &&
      validEmail === "on" &&
      mobile &&
      mobile.length === 10 &&
      password &&
      role_id
    ) {
      let requestData = {
        username: username,
        email: email,
        mobile: mobile,
        password: password,
        user_role: role_id,
        status: this.state.status,
      };
      AdminApiRequest(requestData, "/admin/adminAddOne", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Your Record Add Successfully!",
              icon: "success",
              successMode: true,
            });
            this.adminGetAll();
            this.setState({ modalIsOpen: false });
          } else if (res.status === 400 || res.status === 401) {
            if (res.data.data[0].mobile) {
              document.querySelector(".err_fromAPI_mobile").innerHTML =
                res.data.data[0].mobile;
            }

            if (res.data.data[0].email) {
              document.querySelector(".err_fromAPI_email").innerHTML =
                res.data.data[0].email;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  edit() {
    var username = this.state.username ? this.state.username : "";
    var email = this.state.email ? this.state.email : "";
    var mobile = this.state.mobile ? this.state.mobile : "";
    var password = this.state.password ? this.state.password : "";
    var role_id = this.state.role_id ? this.state.role_id : "";

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!username) {
      valueErr = document.getElementsByClassName("err_username");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    }
    // eslint-disable-next-line
    var reEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validEmail = "on";
    if (email && !email.match(reEmail)) {
      validEmail = "off";
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!password) {
      valueErr = document.getElementsByClassName("err_password");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!role_id) {
      valueErr = document.getElementsByClassName("err_role_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (username && validEmail === "on" && mobile && password && role_id) {
      const requestData = {
        username: username,
        email: email,
        mobile: mobile,
        password: password,
        user_role: role_id,
        status: this.state.status,
        _id: this.state._id,
      };

      AdminApiRequest(requestData, "/admin/updateAdmin", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Your Record Add Successfully!",
              icon: "success",
              successMode: true,
            });
            this.adminGetAll();
            this.setState({ editmodalIsOpen: false });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  async deleteRecord(id) {
    await swal({
      title: "Delete",
      text: "Delete this record ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const requestData = {
          _id: id,
        };

        AdminApiRequest(requestData, "/admin/adminDeleteOne", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.adminGetAll();
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
            } else {
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  async viewopenModal(val) {
    this.setState({
      show: true,
      mdl_layout__obfuscator_hide: true,
      viewData: await val,
    });
  }

  viewcloseModal() {
    this.setState({
      show: false,
      mdl_layout__obfuscator_hide: false,
    });
  }

  async editopenModal(val) {
    var value = await val;
    this.setState({
      editmodalIsOpen: true,
      username: value.username,
      email: value.email,
      mobile: value.mobile,
      role_selected: value.user_role ? value.user_role.role_name : "",
      role_id: value.user_role ? value.user_role._id : "",
      password: value.password,
      status: value.status,
      _id: value._id,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      password: "",
      username: "",
      role_id: "",
      mobile: "",
      email: "",
    });
  }
  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
  }

  getAllRole() {
    const requestData = {
      skip: 0,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getAllRole", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            rolesData: res.data.data,
            loading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  adminGetAll() {
    this.setState({ loading: true });
    const requestData = {
      user_type: "Admin",
    };
    AdminApiRequest(requestData, "/admin/adminGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            userData: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.adminGetAll();
    this.getAllRole();
  }

  //search
  formHandler1(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  getcustomerfilter = () => {
    this.setState({ loading: true });
    const requestData = {
      username: this.state.user_name_search,
      mobile: this.state.user_mobile_search,
      email: this.state.user_email_search,
      user_role: this.state.search_role,
      status:
        this.state.status_search === "active"
          ? true
          : this.state.status_search === ""
          ? null
          : this.state.status_search === "inactive" && false,
      // user_role:""
    };

    AdminApiRequest(requestData, "/admin/adminGetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            userData: res.data.data,
            loading: false,
            currentPage: 1,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  resetFilters() {
    this.adminGetAll();
    this.setState({
      user_name_search: "",
      user_mobile_search: "",
      user_email_search: "",
      status_search: "",
      search_role: "",
      skip: 0,
      limit: 20,
      currentPage: 1,
    });
  }
  render() {
    return (
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
                        <i className="material-icons">assignment</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title"> Users</h4>
                        <button
                          className="btn btn-primary m-r-5 float-right"
                          onClick={this.openModal}
                        >
                          {" "}
                          <i className="fa fa-plus"></i> Add User{" "}
                        </button>
                      </div>
                      <div className="searching-every searching-5-col popup-arrow-select">
                        <span>
                          <input
                            type="text"
                            name="user_name_search"
                            value={this.state.user_name_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="User Name"
                          ></input>
                        </span>
                        <span>
                          <input
                            type="text"
                            name="user_email_search"
                            value={this.state.user_email_search}
                            className="form-control"
                            autoComplete="off"
                            onChange={this.formHandler1}
                            placeholder="Email"
                          ></input>
                        </span>
                        <span>
                          <select
                            name="search_role"
                            value={this.state.search_role}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option>Select Role</option>
                            {/* <option> None</option> */}
                            {this.state.rolesData && this.state.rolesData[0]
                              ? this.state.rolesData.map((item, Index) => {
                                  return (
                                    <option value={item._id}>
                                      {item.role_name}
                                    </option>
                                  );
                                })
                              : ""}
                          </select>
                        </span>
                        <span>
                          <select
                            name="status_search"
                            value={this.state.status_search}
                            className="form-control"
                            onChange={this.formHandler1}
                          >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">InActive</option>
                          </select>
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
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col">User Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Role</th>
                              <th scope="col">Created At</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <>
                              {this.state.userData.length > 0
                                ? this.state.userData.map((data, Index) => (
                                    <tr>
                                      <td>{data.username}</td>
                                      <td>{data.email}</td>
                                      <td>
                                        {data.user_role
                                          ? data.user_role.role_name
                                          : ""}
                                      </td>
                                      <td>
                                        {new Date(
                                          data.created_at
                                        ).toLocaleDateString()}
                                      </td>
                                      <td
                                        className={
                                          data.status === true
                                            ? "view-status processed"
                                            : "view-section inprocessed"
                                        }
                                      >
                                        {data.status === true
                                          ? "Active"
                                          : "Inactive"}
                                      </td>
                                      <td>
                                        <i
                                          className="fa fa-eye hover-with-cursor m-r-5"
                                          onClick={this.viewopenModal.bind(
                                            this,
                                            data
                                          )}
                                        ></i>
                                        <i
                                          className="fa fa-edit  hover-with-cursor m-r-5"
                                          onClick={this.editopenModal.bind(
                                            this,
                                            data
                                          )}
                                        ></i>
                                        <i
                                          className="fa fa-trash hover-with-cursor m-r-5"
                                          onClick={this.deleteRecord.bind(
                                            this,
                                            data._id
                                          )}
                                        ></i>
                                      </td>
                                    </tr>
                                  ))
                                : "No Data Found"}
                              {this.state.loading ? (
                                <tr>
                                  <td>Loading...</td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Add model here */}
                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                      style={customStyles}
                    >
                      <div role="dialog" className="user-pop-block">
                        <div className="modal-dialog">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.closeModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Add User</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      User Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="username"
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter User Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_username"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      User Role
                                      {/* <span className="asterisk">*</span> */}
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      className="form-control"
                                      name="role_id"
                                      onChange={(val) => this.formHandler(val)}
                                    >
                                      <option selected disabled>
                                        Select Role
                                      </option>
                                      {/* <option> None</option> */}
                                      {this.state.rolesData &&
                                      this.state.rolesData[0]
                                        ? this.state.rolesData.map(
                                            (item, Index) => {
                                              return (
                                                <option value={item._id}>
                                                  {item.role_name}
                                                </option>
                                              );
                                            }
                                          )
                                        : ""}
                                    </select>{" "}
                                    <span className="err err_role_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Mobile<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="mobile"
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter Mobile Number"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_mobile err_fromAPI_mobile"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Email <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="email"
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter E-Mail"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_email err_fromAPI_email"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Password{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="password"
                                      name="password"
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter Password"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_password"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      name="status"
                                      onChange={(ev) =>
                                        this.handleChangeStatus(ev)
                                      }
                                      checked={this.state.status}
                                      id="normal-switch"
                                    />
                                  </div>
                                </div>

                                <div className="modal-bottom">
                                  {/* <button className="btn btn-primary feel-btn" onClick={this.closeModal}>Cancel</button> */}
                                  <button
                                    type="button"
                                    className="btn btn-primary feel-btn"
                                    onClick={this.add}
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

                    {/* Edit Modal */}
                    <Modal
                      isOpen={this.state.editmodalIsOpen}
                      onRequestClose={this.editcloseModal}
                      style={customStyles}
                    >
                      <div role="dialog" className="user-pop-block">
                        <div className="modal-dialog">
                          <div className="modal-content default_form_design">
                            <button
                              type="button"
                              className="close"
                              onClick={this.editcloseModal}
                            >
                              &times;
                            </button>
                            <h4 className="modal-title">Edit User</h4>
                            <div className="modal-form-bx">
                              <form>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      User Name{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="username"
                                      value={this.state.username}
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter User Name"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_username"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      User Role
                                      {/* <span className="asterisk">*</span> */}
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <select
                                      className="form-control"
                                      name="role_id"
                                      onChange={(val) => this.formHandler(val)}
                                    >
                                      <option disabled>Select Role</option>
                                      {/* <option>{}</option> */}
                                      {/* <option selected={this.state.role_selected}>{this.state.role_selected ? this.state.role_selected : "Select Role" }</option> */}
                                      {this.state.rolesData &&
                                      this.state.rolesData[0]
                                        ? this.state.rolesData.map(
                                            (item, Index) => {
                                              return (
                                                <option
                                                  value={item._id}
                                                  selected={
                                                    this.state.role_selected ===
                                                    item.role_name
                                                      ? true
                                                      : false
                                                  }
                                                >
                                                  {item.role_name}
                                                </option>
                                              );
                                            }
                                          )
                                        : ""}
                                    </select>{" "}
                                    <span className="err err_role_name"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Email <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="email"
                                      value={this.state.email}
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter E-Mail"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_email"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Mobile<span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="mobile"
                                      value={this.state.mobile}
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter Mobile Number"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_mobile"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Password{" "}
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="password"
                                      name="password"
                                      value={this.state.password}
                                      autoComplete="off"
                                      className="form-control"
                                      placeholder="Enter Mobile Number"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_password"></span>
                                  </div>
                                </div>

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Status</label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Switch
                                      name="status"
                                      onChange={(ev) =>
                                        this.handleChangeStatus(ev)
                                      }
                                      checked={this.state.status}
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
                        this.state.show
                          ? "view-section show"
                          : "view-section hide"
                      }
                    >
                      <button
                        type="button"
                        className="close"
                        onClick={() => this.viewcloseModal()}
                      >
                        &times;
                      </button>
                      <h4 className="modal-title">View Details </h4>
                      <div className="view-box">
                        <ul>
                          <li>
                            <span className="view-title">User Name</span>
                            <span className="view-status">
                              {this.state.viewData.username}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Email</span>
                            <span className="view-status">
                              {this.state.viewData.email}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Mobile</span>
                            <span className="view-status">
                              {this.state.viewData.mobile}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Created At</span>
                            <span className="view-status">
                              {new Date(
                                this.state.viewData.created_at
                              ).toLocaleDateString()}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Role</span>
                            <span className="view-status">
                              {this.state.viewData.user_role
                                ? this.state.viewData.user_role.role_name
                                : ""}
                            </span>
                          </li>

                          <li>
                            <span className="view-title">Status</span>
                            <span
                              className={
                                this.state.viewData.status === true
                                  ? "view-status processed"
                                  : "view-status inprocessed"
                              }
                            >
                              {this.state.viewData.status === true
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </li>
                          <li>
                            <span className="view-title">Modules</span>
                            <span className="view-status">
                              {this.state.viewData.user_role
                                ? this.state.viewData.user_role.modules.map(
                                    (m, ix) => {
                                      return (
                                        <p style={{ display: "inline" }}>
                                          {m}
                                          {ix ===
                                          this.state.viewData.user_role.modules
                                            .length -
                                            1
                                            ? "."
                                            : " , "}
                                        </p>
                                      );
                                    }
                                  )
                                : ""}
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
                <div className="admin-header"></div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
