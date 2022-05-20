import React from "react";
import { Link } from "react-router-dom";

class Thankyou extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  go_to_home = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <>
        <main>
          <div className="thankxbg">
            <div className="thankyou_jumbotron text-center">
              <h1 className="thankyou_tt display-3">Thank You!</h1>
              <p className="lead">Money Added to Wallet Successfully</p>
              <hr />
              <p className="thankyou_contact">
                Having trouble? <Link to="/contact-us"> Contact us</Link>
              </p>
              <p className="thankyou_lead">
                <button
                  className="thankyou_keepshopping bubscribe-btn"
                  onClick={(ev) => this.go_to_home(ev)}
                >
                  Keep Shopping
                </button>
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default Thankyou;
