import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminfooter from "../../view/admin/elements/admin_footer";
import Adminheader from "../../view/admin/elements/admin_header";
import Adminsiderbar from "../../view/admin/elements/admin_sidebar";

export default class Email extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    var dets = JSON.parse(dt);
    if (dt) {
      var user_det = dets.user_type;
    } else {
      window.location = "/login";
    }

    this.state = {
      user: user_det,
      htmldata: "",
    };

    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorChangeJourney = this.onEditorChangeJourney.bind(this);
    this.Philosophy = this.Philosophy.bind(this);
    this.onEditorChangepartners = this.onEditorChangepartners.bind(this);
    this.onEditorChangeTeam = this.onEditorChangeTeam.bind(this);
  }

  onchang = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onEditorChange(evt) {
    this.setState({
      htmldata: evt.editor.getData(),
    });
  }

  onEditorChangeJourney(evt) {
    this.setState({
      Journey: evt.editor.getData(),
    });
  }

  Philosophy(evt) {
    this.setState({
      Philosophy: evt.editor.getData(),
    });
  }

  onEditorChangepartners(evt) {
    this.setState({
      partners: evt.editor.getData(),
    });
  }

  onEditorChangeTeam(evt) {
    this.setState({
      Team: evt.editor.getData(),
    });
  }

  handleChange(changeEvent) {
    this.setState({
      htmldata: changeEvent.target.value,
    });
  }

  async update() {
    let data = {
      status: true,
      desc: this.state.htmldata ? this.state.htmldata : "",
      Team: this.state.Team ? this.state.Team : "",
      partners: this.state.partners ? this.state.partners : "",
      Philosophy: this.state.Philosophy ? this.state.Philosophy : "",
      Journey: this.state.Journey ? this.state.Journey : "",
    };
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (this.state.htmldata) {
      await AdminApiRequest(data, "/admin/Setting/addAbout", "POST")
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Data Updated!",
              // text: "You clicked the button!",
              icon: "success",
            });
            this.getalluser();
            this.setState({
              loading: false,
              view: "table",
            });
          } else if (res.status === 404) {
            // valueErr = document.getElementsByClassName("err_password");
            // valueErr[0].innerText = "Invalid Credentials !";
            swal({
              title: "Email Already Exist !",
              // text: "Please Try Again",
              icon: "warning",
              dangerMode: true,
            });
            this.setState({ loading: false });
          } else {
            swal({
              title: "You are not permited !",
              text: "Try Again with valid User",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async getalluser() {
    this.setState({ loading: true });
    let user = {};
    await AdminApiRequest(user, "/admin/Setting/getAbout", "GET")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            htmldata: res.data.data.desc,
            partners: res.data.data.partners,
            Philosophy: res.data.data.Philosophy,
            Journey: res.data.data.Journey,
            Team: res.data.data.Team,
          });
          this.setState({ loading: false });
        }
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getalluser();
  }

  render() {
    return (
      <div>
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
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">Journey</div>
                              </div>
                              <div>
                                <CKEditor
                                  type="classic"
                                  config={{
                                    allowedContent: true,
                                  }}
                                  data={this.state.Journey}
                                  onChange={this.onEditorChangeJourney}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">slideshow</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">Philosophy</div>
                              </div>
                              <div>
                                <CKEditor
                                  type="classic"
                                  config={{
                                    allowedContent: true,
                                  }}
                                  data={this.state.Philosophy}
                                  onChange={this.onEditorChangePhilosophy}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">slideshow</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">About Us</div>
                              </div>
                              <div>
                                <CKEditor
                                  type="classic"
                                  config={{
                                    allowedContent: true,
                                    filebrowserBrowseUrl:
                                      "https://kc.storehey.com:3003/ckfinder.html",
                                    filebrowserImageBrowseUrl:
                                      "https://kc.storehey.com:3003/ckfinder.html",
                                    filebrowserUploadUrl:
                                      "https://kc.storehey.com:3003/ckfinder.html",
                                    filebrowserImageUploadUrl:
                                      "https://kc.storehey.com:3003/api/imageUpload?type=Images&responseType=json",
                                    filebrowserWindowWidth: "640",
                                    filebrowserWindowHeight: "480",
                                  }}
                                  data={this.state.htmldata}
                                  onChange={this.onEditorChange}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">slideshow</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">Partners</div>
                              </div>
                              <div>
                                <CKEditor
                                  type="classic"
                                  config={{
                                    allowedContent: true,
                                  }}
                                  data={this.state.partners}
                                  onChange={this.onEditorChangepartners}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">slideshow</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">Team</div>
                              </div>
                              <div>
                                <CKEditor
                                  type="classic"
                                  config={{
                                    allowedContent: true,
                                  }}
                                  data={this.state.Team}
                                  onChange={this.onEditorChangeTeam}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-outline-primary "
                      style={{ margin: "0 auto" }}
                      onClick={() => {
                        this.update();
                      }}
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i> Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-header">
            <Adminfooter />
          </div>
        </div>
        9
      </div>
    );
  }
}
