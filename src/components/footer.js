import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ApiRequest } from "../apiServices/ApiRequest";
// import logo from './logo.svg';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    // var dt = localStorage.getItem('adminInfo');
    // if (dt) { }
    // else {
    //     window.location = "/admin-login";
    //     // this.props.history.push(`/admin-login`)
    // }
    this.state = {
      socialLinks: { linkedin: "", facebook: "" },
    };
  }

  componentDidMount() {
    let requestData = {};
    ApiRequest(requestData, "/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            whatsapp_link: res.data.data[0].whatChatLink,
            socialLinks: {
              ...this.state.socialLinks,
              linkedin: res.data.data[0].linkedin,
              facebook: res.data.data[0].facebook,
              twitter: res.data.data[0].twitter,
              instagram: res.data.data[0].instagram,
              youtube: res.data.data[0].youtube,
            },
          });
          localStorage.setItem("banner", res.data.data[0].banner);
          localStorage.setItem("prdImg", res.data.data[0].image);
          window.sessionStorage.setItem(
            "maintenanceStatus",
            res.data.data[0].maintenanceStatus
          );
          window.sessionStorage.setItem(
            "maintenanceBanner",
            res.data.data[0].maintenanceBanner
          );
          window.sessionStorage.setItem(
            "maintenanceLink",
            res.data.data[0].maintenanceLink
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <footer className="homepage-footer">
        <div className="social-media-wrap">
          <div className="container-fluid">
            <div className="latest_whatsapp_icon" style={{ zIndex: "8" }}>
              <a href={this.state.whatsapp_link} target="_blank">
                <i className="fa fa-whatsapp "></i>
              </a>
            </div>
            <div className="social-media-row">
              <div className="ft-col">
                <p>
                  © 2021 Krishi Cress. All Rights Reserved.{" "}
                  <span>
                    Developed by{" "}
                    <a href="https://www.tech9logy.com/" target="_blank">
                      Tech9logy Creators
                    </a>
                  </span>
                </p>
              </div>
              <div className="ft-col">
                <ul>
                  <li>
                    <Link to="/Privacy-Policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms&conditions">Terms & Conditions</Link>
                  </li>
                  {this.state.socialLinks.instagram ? (
                    <li>
                      <a
                        href={this.state.socialLinks.instagram}
                        target="_blank"
                      >
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.socialLinks.facebook ? (
                    <li>
                      <a href={this.state.socialLinks.facebook} target="_blank">
                        <i className="fa fa-facebook-f"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.socialLinks.linkedin ? (
                    <li>
                      <a href={this.state.socialLinks.linkedin} target="_blank">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                  {this.state.socialLinks.twitter ? (
                    <li>
                      <a href={this.state.socialLinks.twitter} target="_blank">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                  ) : (
                    ""
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
