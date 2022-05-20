import React, { Component } from "react";
import Pagination from "react-js-pagination";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

const noImage = require("../../images/noImage.png");

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

export default class Slides extends Component {
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
      admin_id: "",
      name: "",
      status: true,
      data: [],
      data1: [],
      primary_id: "",
      finaldata: [],
      finaldata1: [],
      loading: true,
      link: "",
      count: "",
      limit: 20,
      currentPage: 1,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  add() {
    var requestData = new FormData();
    var image = document.querySelector('input[name="image"]').files[0];
    var banner_icon = document.querySelector('input[name="banner_icon"]')
      .files[0]
      ? document.querySelector('input[name="banner_icon"]').files[0]
      : "";
    var status = this.state.status;
    var rank = this.state.rank ? this.state.rank : 0;
    var link = this.state.link;

    requestData.append("image", image);
    // requestData.append("banner", banner_image);
    requestData.append("icon", banner_icon);
    requestData.append("status", status);
    requestData.append("rank", rank);
    requestData.append("link", link);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!image) {
      valueErr = document.getElementsByClassName("err_image");
      valueErr[0].innerText = "This Field is Required";
    }

    if (image) {
      AdminApiRequest(requestData, "/admin/createSlide", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            this.getAllSlide();
            this.setState({
              modalIsOpen: false,
              loading: false,
              rank: "",
              link: "",
            });
          } else {
            this.setState({ modalIsOpen: false, loading: false });
            swal({
              title: "Error",
              text: res.data.data || "Try Again !",
              icon: "warning",
              successMode: true,
            });
          }
        })
        .then(() => {
          this.setState({
            loading: true,
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
  edit() {
    var requestData = new FormData();
    var id = this.state.id;
    var image1 = document.querySelector('input[name="image"]').files[0];
    var image = image1 || this.state.image;
    var banner_icon = document.querySelector('input[name="banner_icon"]')
      .files[0]
      ? document.querySelector('input[name="banner_icon"]').files[0]
      : this.state.banner_icon;
    var status = this.state.status;
    var rank = this.state.rank ? this.state.rank : 0;
    var link = this.state.link;

    requestData.append("id", id);
    requestData.append("image", image);
    // requestData.append("banner", banner_image);
    requestData.append("icon", banner_icon);
    requestData.append("status", status);
    requestData.append("rank", rank);
    requestData.append("link", link);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!image) {
      valueErr = document.getElementsByClassName("err_image");
      valueErr[0].innerText = "This Field is Required";
    }

    if (image) {
      AdminApiRequest(requestData, "/admin/updateSlide", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.editcloseModal();
            this.setState({ loading: false });
            swal({
              title: "Success",
              text: "Record Added Successfully !",
              icon: "success",
              successMode: true,
            });
            this.getAllSlide();
          } else {
            this.setState({ loading: false });
            swal({
              title: "Error",
              text: res.data.data || "Try Again !",
              icon: "warning",
              successMode: true,
            });
          }
        })
        .then(() => {
          this.setState({
            loading: true,
          });
        })
        .catch((error) => {
          alert(error);
        });
    }
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  openEditModal(dt) {
    this.setState({
      editmodalIsOpen: true,
      image: dt.image,
      id: dt._id,
      banner_icon: dt.icon,
      rank: dt.rank,
      link: dt.link,
      status: dt.status,
    });
  }
  async deleteRecord(id) {
    await swal({
      title: "Delete",
      text: "Delete this record?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({
          loading: true,
        });
        var requestData = {
          _id: id,
        };
        AdminApiRequest(requestData, "/admin/deleteSlide", "POST", "")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Success",
                text: "Record Deleted Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getAllSlide();
              this.setState({ modalIsOpen: false, loading: false });
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
            alert(error);
          });
      }
    });
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      image: "",
      banner_icon: "",
      status: true,
      rank: "",
      link: "",
    });
  }
  editcloseModal() {
    this.setState({
      editmodalIsOpen: false,
      image: "",
      id: "",
      banner_icon: "",
      status: true,
      rank: "",
      link: "",
    });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.getAllSlide();
  }

  handlePageChange(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    var skip = (pageNumber - 1) * this.state.limit;

    const requestData = {
      skip: skip,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getAllSlide", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getAllSlide() {
    const requestData = {
      skip: this.state.skip,
      limit: this.state.limit,
    };
    AdminApiRequest(requestData, "/admin/getAllSlide", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            data: res.data.data,
            count: res.data.count,
            loading: false,
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
            {this.state.loading === true ? (
              "Loading ..."
            ) : (
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
                          <h4 className="card-title"> Slider</h4>

                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={this.openModal}
                          >
                            {" "}
                            <i className="fa fa-plus"></i> Add Slider{" "}
                          </button>
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
                                <th scope="col">Slider</th>
                                <th scope="col">Link</th>
                                <th scope="col">Rank</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.data && this.state.data[0]
                                ? this.state.data.map((data, Index) => (
                                    <tr>
                                      <td className="">
                                        <a
                                          href={
                                            data.image && data.image[0]
                                              ? imageUrl + data.image
                                              : noImage
                                          }
                                          rel="noreferrer"
                                          target="_blank"
                                        >
                                          <img
                                            style={{ height: 70, width: 100 }}
                                            src={
                                              data.image && data.image[0]
                                                ? imageUrl + data.image
                                                : noImage
                                            }
                                            alt="slide"
                                          />
                                        </a>
                                      </td>
                                      <td>{data.link ? data.link : "-"}</td>
                                      <td>{data.rank}</td>
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
                                          onClick={() =>
                                            this.openEditModal(data)
                                          }
                                          className="fa fa-edit m-r-5"
                                          style={{ cursor: "pointer" }}
                                          aria-hidden="true"
                                        ></i>
                                        <i
                                          className="fa fa-trash hover-with-cursor"
                                          onClick={this.deleteRecord.bind(
                                            this,
                                            data._id
                                          )}
                                        ></i>
                                      </td>
                                    </tr>
                                  ))
                                : this.state.loading
                                ? ""
                                : "No Data Found"}
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
                    onChange={this.handlePageChange}
                  />
                </div>
              </div>
            )}
            {/* Add model here */}
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Add Slide</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Slide - (1920px * 400px)
                              <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_image"></span>
                          </div>
                        </div>

                        {/* <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Slide Image<span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="banner_image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_banner_image"></span>
                          </div>
                        </div> */}

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Icon - (50px * 50px)</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="banner_icon"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_banner_icon"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Rank</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="number"
                              name="rank"
                              className="form-control slider-input"
                              placeholder="Slide Rank"
                              onChange={this.formHandler}
                            />
                            <span className="err err_rank"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Link</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="link"
                              className="form-control slider-input"
                              placeholder="E.g https://www.krishicress.com/"
                              onChange={this.formHandler}
                            />
                            <span className="err err_link"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              onChange={this.handleChangeStatus}
                              checked={this.state.status}
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          {this.state.loading === true ? (
                            <button
                              type="button"
                              className="btn btn-primary m-r-5 float-right"
                            >
                              Saving...
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary m-r-5 float-right"
                              onClick={this.add}
                            >
                              Save
                            </button>
                          )}
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
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Edit Slide</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Slide - (1920px * 400px)
                              <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            {this.state.image ? (
                              <img
                                src={imageUrl + this.state.image}
                                style={{ maxHeight: 50 }}
                              />
                            ) : (
                              ""
                            )}
                            <input
                              type="file"
                              name="image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_image"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Icon - (50px * 50px)</label>
                          </div>
                          <div className="modal-right-bx">
                            {this.state.banner_icon ? (
                              <img
                                src={imageUrl + this.state.banner_icon}
                                style={{ maxHeight: 50 }}
                              />
                            ) : (
                              ""
                            )}
                            <input
                              type="file"
                              name="banner_icon"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_banner_icon"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Rank</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="number"
                              name="rank"
                              value={this.state.rank}
                              className="form-control slider-input"
                              placeholder="Slide Rank"
                              onChange={this.formHandler}
                            />
                            <span className="err err_rank"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Link</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="link"
                              value={this.state.link}
                              className="form-control slider-input"
                              placeholder="E.g https://www.krishicress.com/"
                              onChange={this.formHandler}
                            />
                            <span className="err err_link"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              onChange={this.handleChangeStatus}
                              checked={this.state.status}
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="btn btn-primary m-r-5 float-right"
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
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
