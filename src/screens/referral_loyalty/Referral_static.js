import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  EmailIcon,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import "../../assets/css/loyality-referral.css";
import { userdetails } from "../../redux/actions/actions";
const dynamicurl = "https://krishicress.com/";

class Loyalty_static extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referal_code: "",
      copied: false,
    };
  }

  componentDidMount() {
    this.setState({
      // name: this.props.user_details.name,
      // mobile: this.props.user_details.contactNumber,
      // email: this.props.user_details.email,
      referal_code: this.props.user_details.myRefferalCode,
    });
  }

  textCopied = () => {
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 2000);
  };

  render() {
    return (
      <>
        <main classNameName="page-content">
          <section className="page-banner referral-banner-top">
            <div className="banner-figure">
              <img src="/img/referral-01.jpg" />
            </div>
            {this.state.referal_code ? (
              <div className="banner-top-text referral-heading-baner">
                <CopyToClipboard
                  text={
                    " Hey," +
                    `\n` +
                    "I have been enjoying fresh produce, cheese, kombucha and a lot artisanal products from Krishi Cress." +
                    `\n` +
                    "I am sharing this referral link with you. Use it to sign up and place an order." +
                    `\n` +
                    "You will get 5%, 10% and 15% off on your 1st, 2nd and 3rd order respectively." +
                    `\n` +
                    "Happy cooking! " +
                    `\n` +
                    dynamicurl +
                    "account/" +
                    this.state.referal_code
                  }
                  onCopy={() => this.textCopied()}
                >
                  <a
                    href="javascript:void(0);"
                    onClick={(e) => e.preventDefault()}
                  >
                    {this.state.copied ? (
                      <span style={{ color: "white" }}>
                        Copied To Clipboard{" "}
                        <i
                          className="fa fa-check"
                          style={{ color: "white" }}
                        ></i>{" "}
                      </span>
                    ) : (
                      <span style={{ color: "white" }}>
                        Referral Code: {this.state.referal_code}{" "}
                        <i
                          className="fa fa-copy"
                          style={{ color: "white" }}
                        ></i>
                      </span>
                    )}
                  </a>
                </CopyToClipboard>

                <div className="referral-tbn">
                  <div style={{ padding: 20 }}>
                    <span title="Whatsapp" style={{ margin: 10 }}>
                      <WhatsappShareButton
                        url={
                          " Hey," +
                          `\n` +
                          "I have been enjoying fresh produce, cheese, kombucha and a lot artisanal products from Krishi Cress." +
                          `\n` +
                          `\n` +
                          "I am sharing this referral link with you. Use it to sign up and place an order." +
                          `\n` +
                          `\n` +
                          "You will get 5%, 10% and 15% off on your 1st, 2nd and 3rd order respectively." +
                          `\n` +
                          `\n` +
                          "Happy cooking! " +
                          `\n` +
                          `\n` +
                          dynamicurl +
                          "account/" +
                          this.state.referal_code
                        }
                      >
                        <WhatsappIcon></WhatsappIcon>
                      </WhatsappShareButton>
                    </span>
                    <span title="Email" style={{ margin: 10 }}>
                      <EmailShareButton
                        url={
                          " Hey," +
                          `\n` +
                          "I have been enjoying fresh produce, cheese, kombucha and a lot artisanal products from Krishi Cress." +
                          `\n` +
                          "I am sharing this referral link with you. Use it to sign up and place an order." +
                          `\n` +
                          "You will get 5%, 10% and 15% off on your 1st, 2nd and 3rd order respectively." +
                          `\n` +
                          "Happy cooking! " +
                          `\n` +
                          dynamicurl +
                          "account/" +
                          this.state.referal_code
                        }
                      >
                        <EmailIcon></EmailIcon>
                      </EmailShareButton>
                    </span>
                    <span title="Telegram" style={{ margin: 10 }}>
                      <TelegramShareButton
                        url={
                          " Hey," +
                          `\n` +
                          "I have been enjoying fresh produce, cheese, kombucha and a lot artisanal products from Krishi Cress." +
                          `\n` +
                          "I am sharing this referral link with you. Use it to sign up and place an order." +
                          `\n` +
                          "You will get 5%, 10% and 15% off on your 1st, 2nd and 3rd order respectively." +
                          `\n` +
                          "Happy cooking! " +
                          `\n` +
                          dynamicurl +
                          "account/" +
                          this.state.referal_code
                        }
                      >
                        <TelegramIcon></TelegramIcon>
                      </TelegramShareButton>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="banner-overlay"></div>
          </section>
          <div className="container-fluid">
            <div className="referral-intro">
              <h3>
                Each time a friend uses your referral code, both of you get
                <br /> the following benefits:
              </h3>
            </div>
            <div className="referaal-row">
              <div className="referaal-col">
                <h5>
                  You Get
                  <br />
                  <strong>50 Krishi Seeds</strong>
                </h5>
                <div className="circle-order">
                  <div className="circle-inner">
                    <h6>
                      1st
                      <br />
                      Order
                    </h6>
                  </div>
                </div>
                <div className="bottom-cirlec">
                  <div className="bottom-circle-inner">
                    <div className="referral-fig">
                      <img src="/img/1st-referral.png" />
                    </div>
                    <p>
                      Your friend gets
                      <br />
                      <strong>5% off on their order</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="referaal-col">
                <h5>
                  You Get
                  <br />
                  <strong>100 Krishi Seeds</strong>
                </h5>
                <div className="circle-order">
                  <div className="circle-inner">
                    <h6>
                      2nd
                      <br />
                      Order
                    </h6>
                  </div>
                </div>
                <div className="bottom-cirlec">
                  <div className="bottom-circle-inner">
                    <div className="referral-fig">
                      <img src="/img/2nd-referral.png" />
                    </div>
                    <p>
                      Your friend gets
                      <br />
                      <strong>10% off on their order</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="referaal-col">
                <h5>
                  You Get
                  <br />
                  <strong>150 Krishi Seeds</strong>
                </h5>
                <div className="circle-order">
                  <div className="circle-inner">
                    <h6>
                      3rd
                      <br />
                      Order
                    </h6>
                  </div>
                </div>
                <div className="bottom-cirlec">
                  <div className="bottom-circle-inner">
                    <div className="referral-fig">
                      <img src="/img/3rd-referral.png" />
                    </div>
                    <p>
                      Your friend gets
                      <br />
                      <strong>15% off on their order</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {this.state.referal_code ? (
              ""
            ) : (
              <div className="referral-tbn">
                <Link to="/cart">Refer A Friend Here</Link>
              </div>
            )}
          </div>
        </main>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});
const dispatchStateToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Loyalty_static);
