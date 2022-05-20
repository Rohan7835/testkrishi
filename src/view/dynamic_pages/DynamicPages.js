import React, { Component } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import Pagination from "react-js-pagination";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

const displayBlock = {
  display: "block",
};
export default class DynamicPages extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
      var admin = JSON.parse(dt);
      console.log(admin);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      user_id: "",
      seedValueinRupee: 0,
      whatChatLink: "",
      productImage: "",
      exemptDelivery: false,
      preOrder: false,
      modalIsOpen: false,
      allKeys: [],
      status: false,
    };
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
      loading: true,
    });
    var skip = (pageNumber - 1) * this.state.limit;
    this.getcustomerfilter(skip);
  }
  addkey = () => {
    var name = this.state.name;
    var FooterVisibility = this.state.FooterVisibility;
    var HeaderVisibility = this.state.HeaderVisibility;
    var detail = this.state.detail;
    var icon = this.state.icon;
    var image = this.state.image;
    var meta_desc = this.state.meta_desc;
    var meta_title = this.state.meta_title;
    var priority = this.state.priority;
    var status = this.state.status;
    var title = this.state.title;
    var data = {
      name,
      FooterVisibility,
      HeaderVisibility,
      detail,
      icon,
      image,
      meta_desc,
      meta_title,
      priority,
      status,
      title,
    };
    if (!name) {
      swal({
        title: "Error",
        text: "Name is required",
        icon: "warning",
      });
    }
    if (!detail) {
      swal({
        title: "Error",
        text: "detail is required",
        icon: "warning",
      });
    }
    if (!title) {
      swal({
        title: "Error",
        text: "title is required",
        icon: "warning",
      });
    }
    if ((name, detail, title)) {
      AdminApiRequest(data, "/admin/AddOne", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Details Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.GetPaymentKeys();
            this.closeModal();
          } else {
            swal({
              title: "Network error ",
              text: "Please try again after some time !!!",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  componentDidMount() {
    this.GetAdminSetting();
    this.GetPaymentKeys();
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
  }
  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/admin/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("qwertyuiop", res.data.data[0]);
          this.setState({
            mailBanner: res.data.data[0].mailBanner,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  GetPaymentKeys() {
    let data = {};
    AdminApiRequest(data, "/admin/page/GetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allKeys: res.data.data,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  delete = (dt) => {
    var data = {
      _id: dt,
    };
    swal({
      title: "Are you sure?",
      // text: "This payment method will be deleted permanently.",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          closeModal: true,
        },
      },
    }).then((status) => {
      if (status) {
        AdminApiRequest(data, "/admin/page/deleteOne", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Deleted successfully!",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
              this.GetPaymentKeys();
            } else {
              swal({
                title: "Network error ",
                text: "Please try again after some time !!!",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };
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
                        <i className="material-icons">inventory_2</i>
                      </div>
                    </div>

                    <div className="card-body">
                      <div className="manage_up_add_btn">
                        <h4 className="card-title">Dynamic Pages</h4>
                        <Link to="/add-dynamic-pages">
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            title="Add Product"
                          >
                            <i className="fa fa-plus"></i> Add
                          </button>
                        </Link>
                      </div>
                      {/* <div className="searching-every searching-4-col popup-arrow-select">
                            <span>
                              <input
                                type="text"
                                name="product_name_search"
                                value={this.state.product_name_search}
                                className="form-control"
                                autoComplete="off"
                                onChange={this.formHandler1}
                                placeholder="Product Name"
                              ></input>
                            </span>
                            <span>
                              <SelectSearch
                                options={this.state.searchCategoryOptions}
                                name="product_cat_search"
                                closeOnSelect={false}
                                value={this.state.selectedSearchCat_id.value}
                                placeholder="category"
                                onChange={(e) => {
                                  this.setState({
                                    selectedSearchCat_id: e,
                                  });
                                }}
                                className="select-search"
                              />
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
                          </div> */}

                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col">Icon</th>
                              <th scope="col">Image</th>
                              <th scope="col">Name</th>
                              <th scope="col">Title</th>
                              <th scope="col">Priority</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.allKeys &&
                            this.state.allKeys.length > 0 ? (
                              this.state.allKeys.map((item, Index) => (
                                <tr key={Index}>
                                  <td>
                                    {item.icon ? (
                                      <img src={imageUrl + item.icon} />
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td>
                                    {item.image ? (
                                      <img src={imageUrl + item.image} />
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td>{item.name}</td>
                                  <td>{item.title}</td>
                                  <td scope="col">{item.priority || ""}</td>

                                  <td>
                                    {item.status ? (
                                      <span className="text-success">
                                        Active
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        Inactive
                                      </span>
                                    )}
                                    {/* <Switch
                                       onChange={() =>
                                         this._handleStatus(item, !item.status)
                                       }
                                       disabled
                                       checked={item.status}
                                       height={13}
                                       width={25}
                                       id="normal-switch"
                                     /> */}
                                  </td>
                                  <td>
                                    <a
                                      target="_blank"
                                      href={"/view/" + item._id}
                                    >
                                      <i
                                        className="fa fa-eye hover-with-cursor m-r-5"
                                        style={{ cursor: "pointer" }}
                                        title={"Edit"}
                                      ></i>
                                    </a>
                                    <Link
                                      to={"/edit-dynamic-pages/" + item._id}
                                    >
                                      <i
                                        className="fa fa-pencil-square-o"
                                        style={{ cursor: "pointer" }}
                                        title={"Edit"}
                                      ></i>
                                    </Link>
                                    <i
                                      className="fa fa-trash  m-r-5"
                                      style={{ cursor: "pointer" }}
                                      title={"Delete"}
                                      onClick={() => this.delete(item._id)}
                                    ></i>
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
                                <td colSpan="9" className="text-center">
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
              <Pagination
                hideNavigation
                activePage={this.state.currentPage}
                itemsCountPerPage={this.state.limit}
                totalItemsCount={this.state.count}
                onChange={this.handlePageChange}
              />
            </div>
          </div>

          {/* <Adminfooter /> */}
        </div>
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
