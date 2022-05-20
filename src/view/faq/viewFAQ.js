import React, { Component } from "react";
import Adminheader from "../../view/admin/elements/admin_header";
import Adminsiderbar from "../../view/admin/elements/admin_sidebar";

export default class ViewFAQ extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {};
  }

  componentDidMount() {
    // console.log('props on detail page -=>', this.props)
  }
  render() {
    return (
      <div>
        {this.state.show ? (
          <ViewFAQ data={this.state.viewData} back={() => this._onBack()} />
        ) : (
          <div className="wrapper ">
            <Adminsiderbar />

            <div className="main-panel">
              <Adminheader />

              {/* {this.state.loading ? (
                <div className="loaderDiv">
                  <div className="loaderStyle">
                    <Loader
                      type="Oval"
                      color="white"
                      height={100}
                      width={100}
                      visible={this.state.loading}
                    />
                  </div>
                </div>
              ) : (
                ""
              )} */}

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
                          <h4 className="card-title"> View FAQ</h4>
                          <a onClick={this.props.back}>
                            <button
                              className="btn btn-primary m-r-5 float-right"
                              title="Back"
                            >
                              <i className="fa fa-angle-double-left "></i> Back
                            </button>
                          </a>

                          <div className="table-responsive">
                            <table
                              className="table table-striped table-no-bordered table-hover"
                              cellSpacing="0"
                              width="100%"
                            >
                              <thead>
                                <tr>
                                  <th scope="col">Title</th>
                                  <th scope="col">Detail</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Question</td>
                                  <td>{this.props.data.question}</td>
                                </tr>

                                <tr>
                                  <td>Answer</td>
                                  <td>{this.props.data.answer}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* <button className="btn btn-info btn-lg" onClick={() => this._getFAQAPI()}><i className="fa fa-search"></i> <span className="button_text" >Search</span></button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
