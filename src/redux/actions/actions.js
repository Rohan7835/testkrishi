export const simpleAction = () => (dispatch) => {
  dispatch({
    type: "TEST",
    payload: "result_of_simple_action",
  });
};

export const addToCart = (data) => (dispatch) => {
  dispatch({
    type: "CARTDATA",
    payload: data,
  });
};
export const addGroupData = (data) => (dispatch) => {
  dispatch({
    type: "GROUPCARTDATA",
    payload: data,
  });
};
export const changeAddToCartPopup = (data) => (dispatch) => {
  dispatch({
    type: "ADDTOCARTPOPUP",
    payload: data,
  });
};
export const changethankyouAuth = (data) => (dispatch) => {
  dispatch({
    type: "THANKYOUAUTH",
    payload: data,
  });
};

export const quantityChange = (data) => (dispatch) => {
  dispatch({
    type: "CARTQUANTITYCHANGE",
    payload: data,
  });
};
export const checkout = (data) => (dispatch) => {
  dispatch({
    type: "CHECKOUT",
    payload: data,
  });
};

export const deleteSelected = (data) => (dispatch) => {
  dispatch({
    type: "DELETESELECTED",
    payload: data,
  });
};

export const userdetails = (data) => (dispatch) => {
  dispatch({
    type: "USERDETAILS",
    payload: data,
  });
};
export const changeDelivery = (data) => (dispatch) => {
  dispatch({
    type: "DELIVERY",
    payload: data,
  });
};
