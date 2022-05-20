const defaultState = {
  testState: "Initial Data",
  categories: [],
  products: [],
  slides: [],
  banners: [],
  dataInCart: [],
  checkoutData: [],
  user_details: [],
  groupDataCart: [],
  addToCartPopup: false,
  deliveryInfo: {},
  thankyouAuth: false,
};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case "TEST":
      return {
        ...state,
        testState: action.payload,
      };
      break;
    case "GETCATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
      break;
    case "GETPRODUCTS":
      return {
        ...state,
        products: action.payload,
      };
      break;
    case "GETSLIDES":
      return {
        ...state,
        slides: action.payload,
      };
      break;
    case "GETBANNERS":
      return {
        ...state,
        banners: action.payload,
      };
      break;
    case "CHECKOUT":
      return {
        ...state,
        checkoutData: action.payload,
      };
      break;
    case "CARTDATA":
      return {
        ...state,
        dataInCart: action.payload,
      };
      break;
    case "GROUPCARTDATA":
      return {
        ...state,
        groupDataCart: action.payload,
      };
      break;
    case "ADDTOCARTPOPUP":
      return {
        ...state,
        addToCartPopup: action.payload,
      };
      break;
    case "THANKYOUAUTH":
      return {
        ...state,
        thankyouAuth: action.payload,
      };
      break;
    case "CARTQUANTITYCHANGE":
      return {
        ...state,
        cartItemQuantity: action.payload,
      };
      break;
    case "USERDETAILS":
      return {
        ...state,
        user_details: action.payload,
      };
    case "DELIVERY":
      return {
        ...state,
        deliveryInfo: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
