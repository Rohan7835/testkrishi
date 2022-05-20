import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { addToCart, userdetails } from "../../redux/actions/actions";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  logout = async () => {
    await swal({
      title: "Logout",
      text: "Are you sure you want to logout ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        localStorage.setItem("contact", "");
        let a = [];
        this.props.userdetails(a);
        this.props.addToCart(a);
        localStorage.clear();
        window.location.replace("/");
      }
    });
  };

  componentDidMount() {
    const li = document.querySelectorAll(".left_m_content ul li");
    if (this.props.active === "address") {
      li.forEach((l) => l.classList.remove("active"));
      li[1].classList.add("active");
    } else if (this.props.active === "order") {
      li.forEach((l) => l.classList.remove("active"));
      li[2].classList.add("active");
    } else if (this.props.active === "profile") {
      li.forEach((l) => l.classList.remove("active"));
      li[0].classList.add("active");
    } else if (this.props.active === "my-seed") {
      li.forEach((l) => l.classList.remove("active"));
      li[4].classList.add("active");
    } else if (this.props.active === "my-wallet") {
      li.forEach((l) => l.classList.remove("active"));
      li[3].classList.add("active");
    } else if (this.props.active === "my-referral") {
      li.forEach((l) => l.classList.remove("active"));
      li[5].classList.add("active");
    }
  }
  render() {
    return (
      <>
        <div className="left_m_content">
          <h3>My Account</h3>
          <ul>
            <li>
              <Link to="/my-profile">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Profile.jpg"}
                  alt=""
                />
                Profile
              </Link>
            </li>
            <li>
              <Link to="/manage-address">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Address.jpg"}
                  alt=""
                />
                Address
              </Link>
            </li>
            <li>
              <Link to="/order">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Order.jpg"}
                  alt=""
                />
                Orders
              </Link>
            </li>
            <li>
              <Link to="/my-wallet">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Wallet.jpg"}
                  alt=""
                />
                Wallet
              </Link>
            </li>

            <li>
              <Link to="/my-Seed">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Seeds.jpg"}
                  alt=""
                />
                Seeds
              </Link>
            </li>
            <li>
              <Link to="/referral">
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Referral.jpg"}
                  alt=""
                />
                Referral
              </Link>
            </li>
            <li>
              <a onClick={() => this.logout()}>
                <img
                  src={process.env.PUBLIC_URL + "/img/icons/Log Out.jpg"}
                  alt=""
                />
                Logout
              </a>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});
const dispatchStateToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Sidebar);
