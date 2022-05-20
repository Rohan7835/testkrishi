import React from "react";
import Modal from "react-modal";
import Rating from "react-rating";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function ReviewPopup({ closePopup, product_id, user_id }) {
  const [modalIsOpen, setIsOpen] = React.useState(true);
  const [stars, setStars] = React.useState(0);
  const [review, setReview] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function closeModal() {
    closePopup();
  }
  function submitReview() {
    if (!stars && !review) {
      swal({
        title: "Error",
        text: "Please select rating.",
        icon: "warning",
      });
    } else {
      setLoading(true);
      var requestData = new FormData();
      var attachment = document.querySelector('input[name="rating_image"]')
        .files[0];
      requestData.append("product_id", product_id);
      requestData.append("user_id", user_id);
      requestData.append("rating", stars);
      requestData.append("review", review);
      requestData.append("image", attachment);
      ApiRequest(requestData, "/ratingreviews/add", "POST", "", "apiWithImage")
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            swal({
              title: "Success",
              text: "Review submitted succesfully.",
              icon: "success",
            });
            closePopup();
          } else {
            swal({
              title: "Error",
              text: res.data.data,
              icon: "warning",
            });
          }
        })
        .then(() => setLoading(false))
        .catch((error) => {
          console.log(error);
        });
    }
  }
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="review-add">
          <div>
            <p>Rate This Product</p>
            <Rating
              emptySymbol="fa fa-star-o fa-2x"
              fullSymbol="fa fa-star fa-2x"
              fractions={2}
              initialRating={stars}
              onChange={(e) => setStars(e)}
            />
          </div>
          <div className="mt-3">
            <p>Attach image</p>
            <input
              type="file"
              style={{ border: "none" }}
              name="rating_image"
              accept="image/*"
            />
          </div>

          <div className="mt-3">
            <p>Review This Product</p>
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
          </div>
          {loading ? (
            <button className="mt-4">
              {" "}
              <i
                className="fa fa-spinner searchLoading"
                aria-hidden="true"
                style={{ position: "static", color: "white" }}
              ></i>
            </button>
          ) : (
            <button className="mt-4" onClick={() => submitReview()}>
              Submit
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ReviewPopup;
