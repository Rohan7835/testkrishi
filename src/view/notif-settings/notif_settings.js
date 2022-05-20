import React from "react";
import Select from "react-select";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

export default class Notifications_setting extends React.Component {
  constructor(props) {
    super(props);
    let defaultObj = {
      admin_roles: [],
      admin_email: 0,
      user_email: 0,
      sms: 0,
    };
    this.admin_roles = [];
    this.state = {
      order_placed: defaultObj,
      subscription_placed: defaultObj,
      feedback: defaultObj,
      inventory_add: defaultObj,
      inventory_edit: defaultObj,
      loyalty_added: defaultObj,
      loyalty_expiration: defaultObj,
      threshold: defaultObj,
      out_of_stock: defaultObj,
      product_expiration: defaultObj,
      referral_benefit: defaultObj,
      order_accepted: defaultObj,
      order_rejected: defaultObj,
      order_out_for_delivery: defaultObj,
      order_out_for_delivery_email_to_driver: false,
      order_out_for_delivery_sms_to_driver: false,
      order_delivered: defaultObj,
      order_failed: defaultObj,
      wallet_add: defaultObj,
      subscription_accepted: defaultObj,
      subscription_rejected: defaultObj,
      subscription_cancelled: defaultObj,
    };
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
    // 1. load admin roles
    let data = {};
    AdminApiRequest(data, "/admin/getAllRole", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.admin_roles = res.data.data.map((role) => {
            return { value: role._id, label: role.role_name };
          });
          this.setState(this.state);
          console.log("######", this.admin_roles);
          //   load on/off data

          AdminApiRequest(data, "/admin/email_sms_on_off/get", "GET")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                console.log("qwertyuiop", res.data.data);
                this.setState({
                  ...res.data.data,
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

  update() {
    console.log("::::::: ", this.state);

    let data = this.state;
    AdminApiRequest(data, "/admin/email_sms_on_off/update", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          console.log("okkkkkkkk data saved", res.data.data);
          swal({
            title: "Success",
            text: "Updated Successfully !",
            icon: "success",
            successMode: true,
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

  render() {
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="content">
              <div className="container-fluid">
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title mb-5">Notification</h4>
                      <div className="row">
                        <div className="col-3 mb-3 pr-3"></div>
                        <div className="col-2 mb-3">
                          <strong>User Email</strong>
                        </div>
                        <div className="col-1 mb-3">
                          <strong>User SMS</strong>
                        </div>
                        <div className="col-4 mb-3">
                          <strong>Admin Roles</strong>
                        </div>
                        <div className="col-2 mb-3">
                          <strong>Admin Email</strong>
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Placed</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_placed: {
                                    ...prevState.order_placed,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_placed.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_placed: {
                                    ...prevState.order_placed,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_placed.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.order_placed.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_placed_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_placed: {
                                    ...prevState.order_placed,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_placed: {
                                    ...prevState.order_placed,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_placed.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Accepted</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_accepted: {
                                    ...prevState.order_accepted,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_accepted.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_accepted: {
                                    ...prevState.order_accepted,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_accepted.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.order_accepted.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_accepted_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_accepted: {
                                    ...prevState.order_accepted,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_accepted: {
                                    ...prevState.order_accepted,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_accepted.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Rejected</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_rejected: {
                                    ...prevState.order_rejected,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_rejected.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_rejected: {
                                    ...prevState.order_rejected,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_rejected.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.order_rejected.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_rejected: {
                                    ...prevState.order_rejected,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_rejected: {
                                    ...prevState.order_rejected,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_rejected.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Out For Delivery</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_out_for_delivery: {
                                    ...prevState.order_out_for_delivery,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={
                              this.state.order_out_for_delivery.user_email
                            }
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_out_for_delivery: {
                                    ...prevState.order_out_for_delivery,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_out_for_delivery.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.order_out_for_delivery.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_out_for_delivery: {
                                    ...prevState.order_out_for_delivery,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_out_for_delivery: {
                                    ...prevState.order_out_for_delivery,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_out_for_delivery.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Delivered</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_delivered: {
                                    ...prevState.order_delivered,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_delivered.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_delivered: {
                                    ...prevState.order_delivered,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_delivered.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.order_delivered.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_delivered: {
                                    ...prevState.order_delivered,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_delivered: {
                                    ...prevState.order_delivered,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_delivered.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Order Failed</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_failed: {
                                    ...prevState.order_failed,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_failed.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_failed: {
                                    ...prevState.order_failed,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_failed.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.order_failed.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_failed: {
                                    ...prevState.order_failed,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  order_failed: {
                                    ...prevState.order_failed,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.order_failed.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Subscription Placed</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_placed: {
                                    ...prevState.subscription_placed,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.subscription_placed.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_placed: {
                                    ...prevState.subscription_placed,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.subscription_placed.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.subscription_placed.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="subscription_placed_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_placed: {
                                    ...prevState.subscription_placed,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_placed: {
                                    ...prevState.subscription_placed,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.subscription_placed.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">
                          {" "}
                          Subscription Accepted{" "}
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_accepted: {
                                    ...prevState.subscription_accepted,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={
                              this.state.subscription_accepted.user_email
                            }
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_accepted: {
                                    ...prevState.subscription_accepted,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.subscription_accepted.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.subscription_accepted.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_accepted: {
                                    ...prevState.subscription_accepted,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_accepted: {
                                    ...prevState.subscription_accepted,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.subscription_accepted.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">
                          {" "}
                          Subscription Rejected{" "}
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_rejected: {
                                    ...prevState.subscription_rejected,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={
                              this.state.subscription_rejected.user_email
                            }
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
      onChange={(checked) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            subscription_rejected: {
              ...prevState.subscription_rejected,
              sms: checked,
            },
          };
        });
      }}
      checked={this.state.subscription_rejected.sms}
      id="normal-switch"
    /> */}
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
      value={this.state.subscription_rejected.admin_roles.map((item) => {
        return this.admin_roles.filter((role) => role.value.toString() == item.toString())[0];
      })}
      isMulti
      name="order_rejected_admin_roles"
      onChange={(data) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            subscription_rejected: {
              ...prevState.subscription_rejected,
              admin_roles: data.map((item) => item.value),
            },
          };
        });
      }}
      options={this.admin_roles}
      className="basic-multi-select"
      classNamePrefix="select"
    /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
      onChange={(checked) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            subscription_rejected: {
              ...prevState.subscription_rejected,
              admin_email: checked,
            },
          };
        });
      }}
      checked={this.state.subscription_rejected.admin_email}
      id="normal-switch"
    /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">
                          {" "}
                          Subscription Cancelled{" "}
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_cancelled: {
                                    ...prevState.subscription_cancelled,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={
                              this.state.subscription_cancelled.user_email
                            }
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
      onChange={(checked) => {
        this.setState((prevState) => {
          return {
            ...prevState,
            subscription_cancelled: {
              ...prevState.subscription_cancelled,
              sms: checked,
            },
          };
        });
      }}
      checked={this.state.subscription_cancelled.sms}
      id="normal-switch"
    /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.subscription_cancelled.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_cancelled: {
                                    ...prevState.subscription_cancelled,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  subscription_cancelled: {
                                    ...prevState.subscription_cancelled,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={
                              this.state.subscription_cancelled.admin_email
                            }
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Feedback</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  feedback: {
                                    ...prevState.feedback,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.feedback.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  feedback: {
                                    ...prevState.feedback,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.feedback.sms}
                            id="normal-switch"
                          />
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.feedback.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="feedback_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  feedback: {
                                    ...prevState.feedback,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  feedback: {
                                    ...prevState.feedback,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.feedback.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Inventory Add</div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_add: {
                                    ...prevState.inventory_add,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_add.user_email}
                            id="normal-switch"
                          /> */}
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_add: {
                                    ...prevState.inventory_add,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_add.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.inventory_add.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="inventory_add_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_add: {
                                    ...prevState.inventory_add,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_add: {
                                    ...prevState.inventory_add,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_add.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3"> Inventory Edit </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_edit: {
                                    ...prevState.inventory_edit,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_edit.user_email}
                            id="normal-switch"
                          /> */}
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_edit: {
                                    ...prevState.inventory_edit,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_edit.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.inventory_edit.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_edit: {
                                    ...prevState.inventory_edit,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  inventory_edit: {
                                    ...prevState.inventory_edit,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.inventory_edit.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">
                          Loyalty Addded by Admin
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_added: {
                                    ...prevState.loyalty_added,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_added.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_added: {
                                    ...prevState.loyalty_added,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_added.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.loyalty_added.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="loyalty_added_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_added: {
                                    ...prevState.loyalty_added,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_added: {
                                    ...prevState.loyalty_added,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_added.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Loyalty Expiration</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_expiration: {
                                    ...prevState.loyalty_expiration,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_expiration.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_expiration: {
                                    ...prevState.loyalty_expiration,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_expiration.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.loyalty_expiration.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="loyalty_expiration_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_expiration: {
                                    ...prevState.loyalty_expiration,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  loyalty_expiration: {
                                    ...prevState.loyalty_expiration,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.loyalty_expiration.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Referral Benefit</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  referral_benefit: {
                                    ...prevState.referral_benefit,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.referral_benefit.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  referral_benefit: {
                                    ...prevState.referral_benefit,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.referral_benefit.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          {/* <Select
                            value={this.state.referral_benefit.admin_roles.map((item) => {
                              return this.admin_roles.filter(
                                (role) => role.value.toString() == item.toString()
                              )[0];
                            })}
                            isMulti
                            name="referral_benefit_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  referral_benefit: {
                                    ...prevState.referral_benefit,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          /> */}
                        </div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  referral_benefit: {
                                    ...prevState.referral_benefit,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.referral_benefit.admin_email}
                            id="normal-switch"
                          /> */}
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Threshold</div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  threshold: {
                                    ...prevState.threshold,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.threshold.user_email}
                            id="normal-switch"
                          /> */}
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  threshold: {
                                    ...prevState.threshold,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.threshold.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.threshold.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="threshold_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  threshold: {
                                    ...prevState.threshold,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  threshold: {
                                    ...prevState.threshold,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.threshold.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Out of Stock</div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  out_of_stock: {
                                    ...prevState.out_of_stock,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.out_of_stock.user_email}
                            id="normal-switch"
                          /> */}
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  out_of_stock: {
                                    ...prevState.out_of_stock,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.out_of_stock.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.out_of_stock.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="out_of_stock_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  out_of_stock: {
                                    ...prevState.out_of_stock,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  out_of_stock: {
                                    ...prevState.out_of_stock,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.out_of_stock.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Product Expiration</div>
                        <div className="col-2 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  product_expiration: {
                                    ...prevState.product_expiration,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.product_expiration.user_email}
                            id="normal-switch"
                          /> */}
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  product_expiration: {
                                    ...prevState.product_expiration,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.product_expiration.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.product_expiration.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="product_expiration_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  product_expiration: {
                                    ...prevState.product_expiration,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  product_expiration: {
                                    ...prevState.product_expiration,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.product_expiration.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="row mb-5 pr-3">
                        <div className="col-3 mb-3">Wallet Money Add</div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  wallet_add: {
                                    ...prevState.wallet_add,
                                    user_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.wallet_add.user_email}
                            id="normal-switch"
                          />
                        </div>
                        <div className="col-1 mb-3">
                          {/* <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  wallet_add: {
                                    ...prevState.wallet_add,
                                    sms: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.wallet_add.sms}
                            id="normal-switch"
                          /> */}
                        </div>

                        <div className="col-4 mb-3">
                          <Select
                            value={this.state.wallet_add.admin_roles.map(
                              (item) => {
                                return this.admin_roles.filter(
                                  (role) =>
                                    role.value.toString() == item.toString()
                                )[0];
                              }
                            )}
                            isMulti
                            name="order_rejected_admin_roles"
                            onChange={(data) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  wallet_add: {
                                    ...prevState.wallet_add,
                                    admin_roles: data.map((item) => item.value),
                                  },
                                };
                              });
                            }}
                            options={this.admin_roles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </div>
                        <div className="col-2 mb-3">
                          <Switch
                            onChange={(checked) => {
                              this.setState((prevState) => {
                                return {
                                  ...prevState,
                                  wallet_add: {
                                    ...prevState.wallet_add,
                                    admin_email: checked,
                                  },
                                };
                              });
                            }}
                            checked={this.state.wallet_add.admin_email}
                            id="normal-switch"
                          />
                        </div>
                      </div>
                      {/*  */}
                      <div className="my-3 border-top">
                        <h4 className="card-title my-3">
                          Order out for delivery for driver
                        </h4>
                        <div className="row mb-5">
                          <div className="col-md-6">
                            <h5>Email</h5>
                            <Switch
                              checked={
                                this.state
                                  .order_out_for_delivery_email_to_driver
                              }
                              onChange={(e) =>
                                this.setState({
                                  order_out_for_delivery_email_to_driver: e,
                                })
                              }
                              id="normal-switch"
                            />
                          </div>
                          <div className="col-md-6">
                            <h5>SMS</h5>
                            <Switch
                              checked={
                                this.state.order_out_for_delivery_sms_to_driver
                              }
                              onChange={(e) =>
                                this.setState({
                                  order_out_for_delivery_sms_to_driver: e,
                                })
                              }
                              id="normal-switch"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="my-3 border-top">
                        <h4 className="card-title my-3">Supplier Mail</h4>
                        <div className="row mb-5">
                          <div className="col-md-6">
                            <h5>Add</h5>
                            <Switch
                              checked={this.state.supplier_inventory_add}
                              onChange={(e) =>
                                this.setState({
                                  supplier_inventory_add: e,
                                })
                              }
                              id="normal-switch"
                            />
                          </div>
                          <div className="col-md-6">
                            <h5>Edit</h5>
                            <Switch
                              checked={this.state.supplier_inventory_update}
                              onChange={(e) =>
                                this.setState({
                                  supplier_inventory_update: e,
                                })
                              }
                              id="normal-switch"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <button
                          type="button"
                          className="submit fill-btn"
                          onClick={() => this.update()}
                        >
                          <span className="button-text">Update</span>
                          <span className="button-overlay"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}
