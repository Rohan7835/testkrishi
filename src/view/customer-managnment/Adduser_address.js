import React, { Component } from "react";
import Geocode from "react-geocode";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
const google = window.google;
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");

export default class adduseraddress extends Component {
  constructor(props) {
    super(props);
    var path = this.props.location.pathname;
    var user_id = path.split("/")[2];
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      user_id: user_id,
      location_tag: "",
      editlocattion_tag: "",
      address: "",
      street_address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      all_address: [],
      editcity: "",
      editcountry: "",
      editcreated_at: "",
      edithouseNo: "",
      editpincode: "",
      loading: true,
      editlocality: "",
      editstate: "",
      editstreet: "",
      locality: "",
      edituser_id: "",
      place: null,
      position: {
        lat: 0,
        lng: 0,
      },
    };

    this.changePlaces = this.changePlaces.bind();
    this.changePlaces_edit = this.changePlaces_edit.bind();
  }

  formHandler(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
      modalIsOpenedit: false,
      street_address: "",
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      instructions: "",
      city: "",
      pincode: "",
    });
  };

  openeditModal(ev) {
    this.setState({
      editcity: ev.city,
      editcountry: ev.country,
      editcreated_at: ev.created_at,
      edithouseNo: ev.houseNo,
      editlocattion_tag: ev.locationTag,
      editpincode: ev.pincode,
      editstate: ev.state,
      editstreet: ev.street,
      edituser_id: ev._id,
      editlocality: ev.locality,
      latitude: ev.latitude,
      longitude: ev.longitude,
      delivery_instructions: ev.instructions ? ev.instructinos : "",
    });
    this.setState({ modalIsOpenedit: true });
  }

  update = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.edithouseNo) {
      const requestData = {
        _id: this.state.edituser_id ? this.state.edituser_id : "",
        locationTag: this.state.editlocattion_tag
          ? this.state.editlocattion_tag
          : "",
        houseNo: this.state.edithouseNo ? this.state.edithouseNo : "",
        street: this.state.street_address
          ? this.state.street_address
          : this.state.editstreet,
        city: this.state.editcity ? this.state.editcity : "",
        state: this.state.editstate ? this.state.editstate : "",
        country: this.state.editcountry ? this.state.editcountry : "",
        pincode: this.state.editpincode ? this.state.editpincode : "",
        locality: this.state.editlocality ? this.state.editlocality : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };

      AdminApiRequest(requestData, "/admin/updateUserAddress", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
              modalIsOpenedit: false,
            });
            swal({
              title: "Address Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.usersdetails();
          } else {
            swal({
              title: "Neteork Error!",
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
  };

  save = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (this.state.address === "") {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.street_address === "") {
      valueErr = document.getElementsByClassName("err_street_address");
      valueErr[0].innerText = "Field is Required";
    }

    if (this.state.address && this.state.street_address) {
      const requestData = {
        user_id: this.state.user_id ? this.state.user_id : "",
        locationTag: this.state.location_tag ? this.state.location_tag : "",
        houseNo: this.state.address ? this.state.address : "",
        street: this.state.street_address ? this.state.street_address : "",
        locality: this.state.locality ? this.state.locality : "",
        city: this.state.city ? this.state.city : "",
        state: this.state.state ? this.state.state : "",
        country: this.state.country ? this.state.country : "",
        pincode: this.state.pincode ? this.state.pincode : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };

      AdminApiRequest(requestData, "/admin/addUserAddress", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              verifymobilestatus: "fullytrue",
              buttonstatus: false,
              modalIsOpen: false,
            });
            swal({
              title: "Address Saved",
              icon: "success",
              dangerMode: false,
            });
            this.usersdetails();
          } else {
            swal({
              title: "NetWork Issue, Try Again !!! ",
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

  delete = async (item) => {
    var itemId = item._id;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Your address will be deleted",
      icon: "warning",
      dangerMode: true,
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
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    });
    if (willDelete) {
      const requestData = {
        _id: itemId,
      };

      AdminApiRequest(requestData, "/admin/deleteUserAddress", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Address Deleted Successfully",
              icon: "success",
              dangerMode: true,
            });
            this.usersdetails();
          } else {
            swal({
              title: "User Not Deleted",
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

  usersdetails() {
    const requestData = {
      user_id: this.state.user_id,
    };
    AdminApiRequest(requestData, "/admin/getUserAddress", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_address: res.data.data,
          });
        } else {
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.setState({
      user_id: this.state.user_id,
    });
    this.usersdetails();
  }
  getLocation = (e) => {
    const selectedData = e.value;
    console.log(selectedData);
    this.setState({
      showGoggleAddress: false,
      showInputAddres: true,
      street_address: selectedData.description,
      // latitude: e.coordinates.lat,
      // longitude: e.coordinates.lng,
      country: selectedData.terms[selectedData.terms.length - 1],
      state: "",
      city: "",
      pincode: "",
    });
  };
  changePlaces = (e) => {
    this.setState({
      loading: false,
    });
    const selectedData = e.value;

    // navigator.geolocation.getCurrentPosition(
    //   (e) => this.onSuccess(e, selectedData),
    //   (error) => alert(error)
    // );
    var geocoder = new google.maps.Geocoder();
    var address = e.label;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        var postal = "";
        results[0].address_components.forEach((add) => {
          add.types.forEach((type) => {
            if (type.includes("postal_code")) {
              postal = add.short_name;
            }
          });
        });
        this.setState({
          street_address: results[0].formatted_address,
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
          country: selectedData.terms[selectedData.terms.length - 1].value,
          state: selectedData.terms[selectedData.terms.length - 2].value,
          city: selectedData.terms[selectedData.terms.length - 3].value,
          pincode: postal,
        });
      }
    });
  };
  changePlaces_edit = (e) => {
    this.setState({
      loading: false,
    });
    const selectedData = e.value;
    var geocoder = new google.maps.Geocoder();
    var address = e.label;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        var postal = "";
        results[0].address_components.forEach((add) => {
          add.types.forEach((type) => {
            if (type.includes("postal_code")) {
              postal = add.short_name;
            }
          });
        });
        this.setState({
          street_address: results[0].formatted_address,
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
          country: selectedData.terms[selectedData.terms.length - 1].value,
          state: selectedData.terms[selectedData.terms.length - 2].value,
          city: selectedData.terms[selectedData.terms.length - 3].value,
          pincode: postal,
        });
      }
    });
  };

  getCurrentPosition = async (e) => {
    e.preventDefault();
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.getPositionFromLatLon(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (err) => console.log(err)
    );
  };
  getPositionFromLatLon = (latitude, longitude) => {
    Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;
        const pincode =
          response.results[0].address_components[
            response.results[0].address_components.length - 1
          ].short_name;
        let city, state, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        this.setState({
          city: city,
          state: state,
          country: country,
          street_address: address,
          pincode: pincode,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  render() {
    const street = this.state.street_address;
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
                        <i className="material-icons">category</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title">User Address</h4>
                      <div className="managing_adding_inner_new admin_view_add_new user-blok-space">
                        <Link to="/admin-customer">
                          <button type="button" className="add_addres">
                            Back
                          </button>
                        </Link>
                        <button
                          type="button"
                          className="add_addres"
                          onClick={() => this.openModal()}
                        >
                          Add Address
                        </button>
                      </div>
                      {this.state.all_address &&
                      this.state.all_address.length === 0 ? (
                        this.state.loading === true ? (
                          "Loading ..."
                        ) : (
                          <p>No Address Available</p>
                        )
                      ) : (
                        <div
                          className="address_card"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {this.state.all_address.map((item, index) => (
                            <div
                              className="main_card"
                              style={{
                                justifyContent: "flex-start",
                                borderRadius: "5px",
                              }}
                            >
                              <div className="Card_des">
                                <div className="modal-form-bx">
                                  <div className="heading">
                                    <h2>{item.locationTag}</h2>
                                  </div>

                                  <span>{item.houseNo}</span>
                                  <span>{item.locality}</span>
                                  <span>{item.street}</span>
                                  {/* <span>{item.city}</span>

                            <span>{item.state}</span>
                            <span>{item.country}</span>
                            <span>{item.pincode}</span> */}

                                  <div className="modal-bottom">
                                    <button
                                      type="button"
                                      className="submit fill-btn"
                                      onClick={this.openeditModal.bind(
                                        this,
                                        item
                                      )}
                                    >
                                      <span className="button-text">Edit</span>
                                      <span className="button-overlay"></span>
                                    </button>

                                    <span className="delete_address_del">
                                      <i
                                        onClick={() => this.delete(item)}
                                        className="fa fa-trash delete_address"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {/* add modal */}
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    className="adding-address"
                    contentLabel="Add Address"
                  >
                    <div role="dialog">
                      <div className="modal-dialog manage-add NEW_ADD_NEW">
                        <div className="modal-content">
                          <button
                            type="button"
                            className="close"
                            onClick={this.closeModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Add Address</h4>
                          <div className="modal-form-bx">
                            <form>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Street Address{" "}
                                    <span className="asterisk">*</span>
                                    <a
                                      className="pick-location-btn"
                                      onClick={(e) =>
                                        this.getCurrentPosition(e)
                                      }
                                    >
                                      Pick Current Location
                                    </a>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <p>{this.state.street_address}</p>
                                  <GooglePlacesAutocomplete
                                    apiKey={GOOGLE_API_KEY}
                                    autocompletionRequest={{
                                      componentRestrictions: {
                                        country: ["in"],
                                      },
                                    }}
                                    selectProps={{
                                      value: street,
                                      onChange: (e) => this.changePlaces(e),
                                      noOptionsMessage: () =>
                                        "No More Locations",
                                    }}
                                  />
                                  {/* <GoogleComponent
                                  apiKey={GOOGLE_API_KEY}
                                  country={"country:in"}
                                  language={"en"}
                                  name="street_address"
                                  className="form-control"
                                  coordinates={true}
                                  locationBoxStyle={"custom-style"}
                                  locationListStyle={"custom-style-list"}
                                  onChange={(e) => this.getplaces(e)}
                                /> */}
                                  <span className="focus-border"></span>
                                  <span className="err err_street_address"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    House / Flat No.{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter House / Flat No."
                                    value={this.state.address}
                                    onChange={(ev) => this.formHandler(ev)}
                                  />
                                  <span className="focus-border"></span>
                                  <span className="err err_address"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Landmark</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="locality"
                                    className="form-control"
                                    placeholder="Enter Landmark"
                                    onChange={(ev) => this.formHandler(ev)}
                                  />
                                  <span className="focus-border"></span>
                                  <span className="err err_locality"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Location Tag </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="location_tag"
                                    className="form-control"
                                    placeholder="Enter Location Tag"
                                    onChange={(ev) => this.formHandler(ev)}
                                  />
                                  <span className="focus-border"></span>
                                  <span className="err err_location_tag"></span>
                                </div>
                              </div>

                              <div className="modal-bottom">
                                {/* <button
                                className="cancel blank-btn"
                                onClick={this.closeModal}
                              >
                                <span className="button-text">Cancel</span>
                                <span className="button-overlay"></span>
                              </button> */}
                                <button
                                  type="button"
                                  className="submit fill-btn"
                                  onClick={() => this.save()}
                                >
                                  <span className="button-text">Save</span>
                                  <span className="button-overlay"></span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  {/* View Model end*/}
                  {/* edit modal start */}
                  <Modal
                    isOpen={this.state.modalIsOpenedit}
                    onRequestClose={this.closeModal}
                    className="adding-address"
                    contentLabel="Edit Address"
                  >
                    <div role="dialog">
                      <div className="modal-dialog manage-add NEW_ADD_NEW">
                        <div
                          className="modal-content"
                          style={{ padding: "20px" }}
                        >
                          <button
                            type="button"
                            className="close"
                            onClick={this.closeModal}
                          >
                            &times;
                          </button>
                          <h4 className="modal-title">Edit Address</h4>
                          <div className="modal-form-bx">
                            <form>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Address
                                    <span className="asterisk">*</span>
                                    <a
                                      className="pick-location-btn"
                                      onClick={(e) =>
                                        this.getCurrentPosition(e)
                                      }
                                    >
                                      Pick Current Location
                                    </a>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <span>
                                    {this.state.street_address
                                      ? this.state.street_address
                                      : this.state.editstreet}
                                  </span>
                                  <GooglePlacesAutocomplete
                                    apiKey={GOOGLE_API_KEY}
                                    autocompletionRequest={{
                                      componentRestrictions: {
                                        country: ["in"],
                                      },
                                    }}
                                    selectProps={{
                                      value: street,
                                      onChange: (e) =>
                                        this.changePlaces_edit(e),
                                      noOptionsMessage: () =>
                                        "No More Locations",
                                    }}
                                  />
                                  <span className="err err_editstreet"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    House / Flat No.{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="edithouseNo"
                                    className="form-control"
                                    placeholder="Enter Address"
                                    onChange={(ev) => this.formHandler(ev)}
                                    value={this.state.edithouseNo}
                                  />
                                  <span className="err err_edithouseNo"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Landmark</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="editlocality"
                                    className="form-control"
                                    placeholder="Enter Landmark"
                                    onChange={(ev) => this.formHandler(ev)}
                                    value={this.state.editlocality}
                                  />
                                  <span className="err err_edithouseNo"></span>
                                </div>
                              </div>

                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>
                                    Location Tag{" "}
                                    <span className="asterisk">*</span>
                                  </label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="text"
                                    name="editlocattion_tag"
                                    className="form-control"
                                    placeholder="Enter Location Tag"
                                    onChange={(ev) => this.formHandler(ev)}
                                    value={this.state.editlocattion_tag}
                                  />

                                  <span className="err err_edithouseNo"></span>
                                </div>
                              </div>
                              <div className="modal-bottom">
                                {/* <button
                                className="cancel blank-btn"
                                onClick={this.closeModal}
                              >
                                <span className="button-text">Cancel</span>
                                <span className="button-overlay"></span>
                              </button> */}
                                <button
                                  type="button"
                                  className="submit fill-btn"
                                  onClick={() => this.update()}
                                >
                                  <span className="button-text">Update</span>
                                  <span className="button-overlay"></span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  {/* edit modal end */}
                </div>
                <div
                  onClick={this.viewcloseModal}
                  className={
                    this.state.mdl_layout__obfuscator_hide
                      ? "mdl_layout__obfuscator_show"
                      : "mdl_layout__obfuscator_hide"
                  }
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
