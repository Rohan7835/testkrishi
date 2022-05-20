import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Add_address from "../../components/Address/Add_address";

const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
function Gifting({ passGiftingData, changeGiftingStatus, formCompleted }) {
  const [giftingContent, setGiftingContent] = useState({
    status: false,
    name: "",
    contact: "",
    // address: {},
    note: "",
  });
  const [dataSaved, setDataSaved] = useState(false);
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  const [modalIsOpen, setmodalIsOpen] = useState(false);

  //handling all inputs to state
  const handleForm = (e) => {
    setGiftingContent({ ...giftingContent, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (
      giftingContent.name ||
      giftingContent.contact ||
      giftingContent.note
      // || giftingContent.address.street
    ) {
      // passGiftingData(giftingContent);
      // setDataSaved(true);
    }
  }, [giftingContent]);

  //resetting all data when user selects personal saved address
  useEffect(() => {
    setGiftingContent({
      status: false,
      name: "",
      contact: "",
      // address: {},
      note: "",
    });
    passGiftingData({
      status: false,
      name: "",
      contact: "",
      // address: {},
      note: "",
    });
    setFullAddress("");
    setDataSaved(false);
    setShowData(false);
  }, [changeGiftingStatus]);

  //changing gifting status to true or false and empty all data
  const changeStatus = () => {
    !giftingContent.status ? formCompleted(false) : formCompleted(true);
    setGiftingContent({
      ...giftingContent,
      status: !giftingContent.status,
      name: "",
      contact: "",
      // address: {},
      note: "",
    });
    setFullAddress("");
    setDataSaved(false);
    setShowData(!giftingContent.status);
    // passGiftingData({
    //   status: !giftingContent.status,
    //   name: "",
    //   contact: "",
    //   // address: {},
    //   note: "",
    // });
  };

  //submit form on button click on enter button
  const submitForm = (e) => {
    e.preventDefault();
    console.log(giftingContent.address);
    // if (giftingContent.contact.length === 10 && giftingContent.address.street) {
    if (giftingContent.contact.length === 10) {
      passGiftingData(giftingContent);
      setDataSaved(true);
      formCompleted(true);
      setShowData(false);
      // document.querySelector(".err_location").style.innerHTML = "";
      document.querySelector(".err_mobile").innerHTML = "";
    }
    if (giftingContent.contact.length !== 10) {
      document.querySelector(".err_mobile").innerHTML =
        "Enter Correct contact number";
    }
    // if (!giftingContent.address.street) {
    //   document.querySelector(".err_location").innerHTML = "Required*";
    // }
  };

  const onSuccess = (location, selectedData) => {
    setGiftingContent({
      ...giftingContent,
      address: {
        street: selectedData.description,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        country: selectedData.terms[selectedData.terms.length - 1].value,
        state: selectedData.terms[selectedData.terms.length - 2].value,
        city: selectedData.terms[selectedData.terms.length - 3].value,
        pincode: "",
      },
    });
    setFullAddress(selectedData.description);
    setLoading(false);
  };

  const onError = (error) => {
    setLoading(false);
  };

  // const changePlaces = (e) => {
  //   setLoading(true);
  //   const selectedData = e.value;
  //   navigator.geolocation.getCurrentPosition(
  //     (e) => onSuccess(e, selectedData),
  //     onError
  //   );
  // };
  const changePlaces = (e) => {
    let block, area, city, state, country, pincode;
    console.log(e);
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
    setGiftingContent({
      ...giftingContent,
      address: {
        street: e.formatted_address,
        latitude: e.geometry.location.lat(),
        longitude: e.geometry.location.lng(),
        pincode: pincode ? pincode : "",
        country: country ? country : "",
        state: state ? state : "",
        city: city ? city : "",
      },
    });
    setFullAddress(e.formatted_address);
    setLoading(false);
  };
  const clearAddress = () => {
    setGiftingContent({
      ...giftingContent,
      address: {
        locationTag: "",
        houseNo: "",
        street: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        latitude: "",
        longitude: "",
      },
    });
    setFullAddress("");
  };
  const closeModal = (e) => {
    setmodalIsOpen(false);
    if (e.street) {
      setGiftingContent({
        ...giftingContent,
        address: {
          locationTag: e.locationTag,
          houseNo: e.houseNo,
          street: e.street,
          locality: e.locality,
          city: e.city,
          state: e.state,
          country: e.country,
          pincode: e.pincode,
          latitude: e.latitude,
          longitude: e.longitude,
        },
      });
      setFullAddress(e.street);
      setLoading(false);
    }
  };

  return (
    <div className="Gifting-container">
      <div className="gifting-header">
        <input
          type="checkbox"
          name="giftingstatus"
          className="gift-checkbox"
          checked={!!giftingContent.status}
          onChange={(e) => changeStatus(e)}
        />
        <label htmlFor="giftingstatus">Make this order a gift.</label>
        {dataSaved ? (
          <p onClick={() => setShowData(!showData)}>
            View Details <i className="fa fa-caret-down"></i>
          </p>
        ) : (
          ""
        )}
      </div>
      {showData ? (
        <form onSubmit={(e) => submitForm(e)}>
          <div className="gifting-content">
            <div className="gift-inputs">
              <div>
                <label htmlFor="name">
                  Name <span className="asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={giftingContent.name}
                  onChange={(e) => handleForm(e)}
                  required
                  placeholder="Enter Name"
                />
                <span className="focus-border"></span>
              </div>
              <div>
                <label htmlFor="name">
                  Contact Number <span className="asterisk">*</span>
                  <p className="err err_mobile hideWhenEmpty"></p>
                </label>
                <input
                  type="number"
                  name="contact"
                  value={giftingContent.contact}
                  onChange={(e) => handleForm(e)}
                  required
                  placeholder="Enter Contact Number"
                />
                <span className="focus-border"></span>
              </div>
              {/* <div className="border p-2">
                <label
                  htmlFor="name"
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    {" "}
                    Address <span className="asterisk">*</span>
                    <p className="err_location"></p>
                  </span>
                  {!giftingContent.address.street ? (
                    <button
                      className="btn btn-primary ml-4 submit fill-btn"
                      onClick={() => setmodalIsOpen(true)}
                      style={{ maxWidth: 100 }}
                      type="button"
                    >
                      Add
                    </button>
                  ) : (
                    ""
                  )}
                </label>
                <p>
                  {giftingContent.address.street ? (
                    <span className="cross-address-btn">
                      <i
                        className="fas fa-times"
                        onClick={() => clearAddress()}
                      ></i>{" "}
                    </span>
                  ) : (
                    ""
                  )}
                  {fullAddress}
                </p>
                <span className="focus-border"></span>
              </div> */}
              <div>
                <label htmlFor="name">
                  Notes <span className="asterisk">*</span>
                </label>
                <input
                  type="text"
                  name="note"
                  value={giftingContent.note}
                  onChange={(e) =>
                    e.target.value.length <= 80 ? handleForm(e) : ""
                  }
                  required
                  placeholder="Enter Note"
                />
                <span className="focus-border"></span>
              </div>
            </div>
            {loading ? (
              <button className="submit fill-btn">
                <i
                  className="fa fa-spinner searchLoading"
                  aria-hidden="true"
                ></i>
              </button>
            ) : (
              <button type="submit" className="submit fill-btn">
                Save
              </button>
            )}
          </div>
        </form>
      ) : (
        ""
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => closeModal()}
        className="adding-address"
        contentLabel="Add Address"
      >
        <Add_address
          addressSaved={(e) => closeModal(e)}
          adminPanel={false}
          gifting={true}
        />
      </Modal>
    </div>
  );
}

export default Gifting;
