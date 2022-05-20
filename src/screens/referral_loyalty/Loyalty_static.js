import React from "react";
import "../../assets/css/loyality-referral.css";

class Loyalty_static extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <main className="page-content">
          <section className="page-banner">
            <div className="banner-figure">
              <img src="img/Loyalty prog-04.jpg" />
            </div>

            <div className="banner-overlay"></div>
          </section>
          <div className="container-fluid">
            <section className="loyality-page">
              <div className="loyality-inner">
                <div className="loyal-intro">
                  <p>
                    We are excited to have excited to have you as a part of our
                    community of food lovers and health conscious,
                    environmentally conscious consumers. For all of you we have
                    put in place a Krishi Cress Loyalty program, which allows
                    you to reap benefits of being loyal customers.
                  </p>
                </div>
                <div className="loyal-top">
                  <h2>
                    Every time you order
                    <br /> Krishi Seeds get added to your accounts
                  </h2>
                  <div className="loyal-top-content">
                    <div className="loyal-top-col wh-ti">
                      <div className="loyal-top-row">
                        <div className="wh-icon">
                          <img src="img/reward-iocn.svg" />
                        </div>
                        <div className="loyal-middle-text">
                          <h3>White Tier</h3>
                          <p>Applicable for 1st to 5th Order</p>
                        </div>
                        <div className="loyal-top-icon">
                          <div className="icon-row-loyal">
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                          </div>
                        </div>
                      </div>
                      <div className="loyal-bottom">
                        <p>
                          5% of your order value
                          <br />
                          gets added as Krishi Seeds.
                        </p>
                      </div>
                    </div>
                    <div className="loyal-top-col ye-ti">
                      <div className="loyal-top-row">
                        <div className="wh-icon">
                          <img src="img/yellow-reward.svg" />
                        </div>
                        <div className="loyal-middle-text">
                          <h3>Yellow Tier</h3>
                          <p>Applicable for 6th to 10th Order </p>
                        </div>
                        <div className="loyal-top-icon">
                          <div className="icon-row-loyal">
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                          </div>
                          <div className="icon-row-loyal">
                            <img src="img/yellow-basket.svg" />
                            <img src="img/yellow-basket.svg" />
                            <img src="img/yellow-basket.svg" />
                            <img src="img/yellow-basket.svg" />
                            <img src="img/yellow-basket.svg" />
                          </div>
                        </div>
                      </div>
                      <div className="loyal-bottom">
                        <p>
                          10% of your order value
                          <br />
                          gets added as Krishi Seeds.
                        </p>
                      </div>
                    </div>
                    <div className="loyal-top-col go-ti">
                      <div className="loyal-top-row">
                        <div className="wh-icon">
                          <img src="img/gold-icon.svg" />
                        </div>
                        <div className="loyal-middle-text">
                          <h3>Gold Tier</h3>
                          <p>Applicable for 11th Order Onwards</p>
                        </div>
                        <div className="loyal-top-icon">
                          <div className="icon-row-loyal">
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                          </div>
                          <div className="icon-row-loyal">
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                            <img src="img/shopping-bag-gray.svg" />
                          </div>
                          <div className="icon-row-loyal">
                            <img src="img/gold-basket.svg" />
                            <strong>+</strong>
                          </div>
                        </div>
                      </div>
                      <div className="loyal-bottom">
                        <p>
                          15% of your order value
                          <br />
                          gets added as Krishi Seeds.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="royal-redeem">
                <h2>
                  While checking out you can redeem
                  <br />
                  these Seeds in a similar tier manner.{" "}
                </h2>
                <div className="royal-redeem-inner">
                  <div className="reedm-col-inner">
                    <div className="reedm-heading">
                      <div className="reedm-icon">
                        <img src="img/reward-iocn.svg" />
                      </div>

                      <h3>White Tier</h3>
                    </div>
                    <div className="reedm-text-bottom">
                      <p>5% of the order value.</p>
                    </div>
                  </div>
                  <div className="reedm-col-inner yel-reedm">
                    <div className="reedm-heading">
                      <div className="reedm-icon">
                        <img src="img/yellow-reward.svg" />
                      </div>

                      <h3>Yellow Tier</h3>
                    </div>
                    <div className="reedm-text-bottom">
                      <p>10% of the order value.</p>
                    </div>
                  </div>
                  <div className="reedm-col-inner gol-reedm">
                    <div className="reedm-heading">
                      <div className="reedm-icon">
                        <img src="img/gold-icon.svg" />
                      </div>

                      <h3>Gold Tier</h3>
                    </div>
                    <div className="reedm-text-bottom">
                      <p>15% of the order value.</p>
                    </div>
                  </div>
                </div>
                <div className="reedm-bottom-row">
                  <p>
                    Long story short, from the <strong>2nd order</strong>{" "}
                    onwards you can get upto a{" "}
                    <strong>5% discount, 6th order </strong>onwards upto a{" "}
                    <strong>10% discount</strong> and
                    <br />
                    <strong>11th order</strong> onwards upto a{" "}
                    <strong>15% discount</strong> on all your orders
                    <br />
                    <br />
                    {/* Please find attached a PDF explaining the same with
                    pictures. Let us know if you have any challenges in
                    redeeming your Loyalty Points/Krishi Seeds.{" "} */}
                  </p>
                  {/* <a
                    href="https://www.clickdimensions.com/links/TestPDFfile.pdf"
                    target="_blank"
                  >
                    PDF Download
                  </a> */}
                </div>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }
}

export default Loyalty_static;
