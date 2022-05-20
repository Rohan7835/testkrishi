import React from "react";
import Geocode from "react-geocode";
import Autocomplete from "react-google-autocomplete";
import { connect } from "react-redux";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { ApiRequest } from "../../apiServices/ApiRequest";
const google = window.google;
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");
class Add_address extends React.Component {
  constructor(props) {
    super(props);
    if (!this.props.adminPanel) {
      if (this.props.user_details._id) {
      } else {
        this.props.history.push("/");
        localStorage.clear();
        window.location.reload();
      }
    }
    this.state = {
      user_id: "",
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
      buttonLoading: false,
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
      showPincodeInput: true,
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
      showPincodeInput: true,
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
    this.setState({ modalIsOpenedit: true, showPincodeInput: true });
  }

  save = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.location_tag === "") {
      valueErr = document.getElementsByClassName("err_add_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.address === "" || !this.state.address) {
      valueErr = document.getElementsByClassName("err_address");
      document.querySelector(".err_complete_address").innerHTML =
        "Field is Required";
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.street_address) {
      valueErr = document.getElementsByClassName("err_street_address");
      valueErr[0].innerText = this.state.searchKey
        ? "Please pick google location from dropdown"
        : "Field is Required";
    }
    if (!this.state.city) {
      valueErr = document.getElementsByClassName("err_city");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.state) {
      valueErr = document.getElementsByClassName("err_state");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.country) {
      valueErr = document.getElementsByClassName("err_country");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.pincode === "") {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.pincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }

    if (
      this.state.address &&
      this.state.street_address &&
      this.state.location_tag &&
      this.state.pincode &&
      this.state.pincode.length === 6 &&
      this.state.city &&
      this.state.state &&
      this.state.country
    ) {
      this.setState({ buttonLoading: true });
      const requestData = {
        user_id: this.props.user_id || "",
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
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      if (this.props.gifting) {
        this.props.addressSaved(requestData);
      } else {
        if (
          (localStorage.getItem("contact") &&
            localStorage.getItem("contact") !== "undefined") ||
          this.props.adminPanel
        ) {
          this.props.adminPanel
            ? AdminApiRequest(requestData, "/admin/addUserAddress", "POST")
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
                    this.props.addressSaved();
                  } else if (res.status !== 500) {
                    swal({
                      title: "Error",
                      text: "Network error",
                      icon: "warning",
                      dangerMode: true,
                    });
                  }
                })
                .then(() => {
                  this.setState({ buttonLoading: false });
                })
                .catch((error) => {
                  console.log(error);
                })
            : ApiRequest(requestData, "/addUserAddress", "POST", token)
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
                    this.props.addressSaved();
                  } else if (res.status !== 503) {
                    swal({
                      title: "Error",
                      text: "Network error",
                      icon: "warning",
                      dangerMode: true,
                    });
                  }
                })
                .then(() => {
                  this.setState({ buttonLoading: false });
                })
                .catch((error) => {
                  console.log(error);
                });
        } else {
          // this.props.history.push("/");
          // localStorage.clear();
          // window.location = "/";
          // window.location.reload();
        }
      }
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
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      if (
        localStorage.getItem("contact") &&
        localStorage.getItem("contact") !== "undefined"
      ) {
        ApiRequest(requestData, "/deleteUserAddress", "POST", token)
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
                title: "Address Not Deleted",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.props.history.push("/");
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  usersdetails() {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/getUserAddress", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_address: res.data.data,
          });
        } else if (res.status === 500 && !this.props.adminPanel) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        } else if (res.status === 503 && !this.props.adminPanel) {
          // alert("Please Login Again");
          // window.location = "/";
          // localStorage.setItem("contact", "");
          // let a = [];
          // this.props.userdetails(a);
          // this.props.addToCart(a);
          // localStorage.clear();
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
      user_id: !this.props.adminPanel ? this.props.user_details._id : "",
    });
    // this.usersdetails();
  }
  getLocation = (e) => {
    const selectedData = e.value;
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
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      pincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      // this.setState({ showPincodeInput: false });
    }
  };
  changePlaces_edit = (e) => {
    this.setState({
      loading: false,
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      editpincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      // this.setState({ showPincodeInput: false });
    }
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
        // const address = response.results[0].formatted_address;
        let address = "";
        const addressComponents =
          response.results[0].address_components.length - 1;
        response.results[0].address_components.forEach((com, ix) => {
          if (ix !== 0) {
            if (!address.includes(com.long_name)) {
              address += com.long_name + (ix !== addressComponents ? ", " : "");
            }
          }
        });
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
          editpincode: pincode,
        });
        if (!pincode) {
          this.setState({ showPincodeInput: true });
        } else {
          // this.setState({ showPincodeInput: false });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  clearAddress = () => {
    this.setState({
      street_address: null,
      editstreet: null,
      pincode: "",
      editpincode: "",
      searchKey: null,
      city: "",
      state: "",
      country: "",
    });
  };
  render() {
    const street = this.state.street_address;
    return (
      <>
        {/* add modal */}
        <div role="dialog">
          <div className="modal-dialog manage-add NEW_ADD_NEW">
            <div
              className="modal-content"
              style={{ maxHeight: "85vh", overflowY: "scroll" }}
            >
              <button type="button" className="close" onClick={this.closeModal}>
                &times;
              </button>
              <h4 className="modal-title">Add Address</h4>
              <div className="modal-form-bx">
                <form>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        Google Location <span className="asterisk">*</span>
                        <a
                          className="pick-location-btn"
                          onClick={(e) => this.getCurrentPosition(e)}
                        >
                          Pick Current Location
                        </a>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      {this.state.street_address ? (
                        <p>
                          {" "}
                          <span className="cross-address-btn">
                            <i
                              className="fas fa-times"
                              onClick={() => this.clearAddress()}
                            ></i>{" "}
                          </span>
                          {this.state.street_address}
                        </p>
                      ) : (
                        ""
                      )}
                      <Autocomplete
                        apiKey={GOOGLE_API_KEY}
                        placeholder={this.state.street_address || ""}
                        onChange={(e) =>
                          this.setState({ searchKey: e.target.value })
                        }
                        value={
                          this.state.searchKey ||
                          this.state.street_address ||
                          ""
                        }
                        options={{
                          types: ["geocode", "establishment"],
                          componentRestrictions: {
                            country: ["in"],
                          },
                        }}
                        onPlaceSelected={(e) => this.changePlaces(e)}
                      />
                      {/* <GooglePlacesAutocomplete
                                  apiKey={GOOGLE_API_KEY}
                                  autocompletionRequest={{
                                    componentRestrictions: {
                                      country: ["in"],
                                    },
                                  }}
                                  selectProps={{
                                    value: street,
                                    placeholder: street
                                      ? street.substring(0, 40)
                                      : "Select...",
                                    onChange: (e) => this.changePlaces(e),
                                    noOptionsMessage: () => "No More Locations",
                                  }}
                                /> */}
                      <span className="focus-border"></span>
                      <span className="err err_street_address"></span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        Pincode
                        <span className="asterisk">*</span>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      {this.state.showPincodeInput ? (
                        <input
                          type="number"
                          name="pincode"
                          className="form-control"
                          placeholder="Enter Pincode"
                          value={this.state.pincode}
                          onChange={(ev) => this.formHandler(ev)}
                        />
                      ) : (
                        <input
                          type="number"
                          name="pincode"
                          readOnly={true}
                          className="form-control"
                          placeholder="Enter Pincode"
                          value={this.state.pincode}
                          onChange={(ev) => this.formHandler(ev)}
                        />
                      )}
                      <span className="focus-border"></span>
                      <span className="err err_pincode"></span>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        Complete Address <span className="asterisk">*</span>
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
                      <span className="err err_address err_complete_address"></span>
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
                      <label>
                        Location Tag
                        <span className="asterisk">*</span> (Eg. Home, Office,
                        etc.)
                      </label>
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
                      <span className="err err_location_tag err_add_location_tag"></span>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        City
                        <span className="asterisk">*</span>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="Enter City"
                        value={this.state.city}
                        onChange={(ev) => this.formHandler(ev)}
                      />
                      <span className="focus-border"></span>
                      <span className="err err_city"></span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        State
                        <span className="asterisk">*</span>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        placeholder="Enter State"
                        value={this.state.state}
                        onChange={(ev) => this.formHandler(ev)}
                      />
                      <span className="focus-border"></span>
                      <span className="err err_state"></span>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>
                        Country
                        <span className="asterisk">*</span>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="country"
                        className="form-control"
                        placeholder="Enter Country"
                        value={this.state.country}
                        onChange={(ev) => this.formHandler(ev)}
                      />
                      <span className="focus-border"></span>
                      <span className="err err_country"></span>
                    </div>
                  </div>

                  <div>
                    Your google location (We suggest you put your delivery
                    address coordinates, will help us reach you faster)
                  </div>
                  <div className="modal-bottom">
                    {/* <button
                                className="cancel blank-btn"
                                onClick={this.closeModal}
                              >
                                <span className="button-text">Cancel</span>
                                <span className="button-overlay"></span>
                              </button> */}
                    {this.state.buttonLoading ? (
                      <button type="button" className="submit fill-btn">
                        <span className="button-text" style={{ color: "#fff" }}>
                          <i
                            className="fa fa-spinner searchLoading"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span className="button-overlay"></span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="submit fill-btn"
                        onClick={() => this.save()}
                      >
                        <span className="button-text">Save</span>
                        <span className="button-overlay"></span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* View Model end*/}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Add_address);
