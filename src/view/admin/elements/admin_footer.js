import React, { Component } from "react";
class Adminfooter extends Component {
  render() {
    return (
      <footer className="footer admin_footer">
        <div className="copyright float-right">
          Made with <i className="material-icons">favorite</i> by
          <a href="https://www.tech9logy.com/" target="_blank">
            {" "}
            Tech9logy Creators
          </a>{" "}
          .
        </div>
      </footer>
    );
  }
}
export default Adminfooter;
