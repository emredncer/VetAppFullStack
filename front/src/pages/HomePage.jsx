import React from "react";
import picture1 from "../assets/pic1.jpg";
import picture2 from "../assets/pic2.jpg";
import picture3 from "../assets/pic3.jpg";

export default function HomePage() {
  return (
    <div className="d-flex justify-content-around">
      <div className="container d-flex row d-flex align-items-center">
        <div className="col-6">
          <div
            id="carouselExampleAutoplaying"
            className="carousel slide mx-auto"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner justify-content-center">
              <div className="carousel-item active">
                <img src={picture1} className=" custom-image" alt="pic1" />
              </div>
              <div className="carousel-item">
                <img src={picture2} className=" custom-image" alt="pic2" />
              </div>
              <div className="carousel-item">
                <img src={picture3} className=" custom-image" alt="pic3" />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <div className="col-6">
          <div className="row m-5">
            <div className="col-12 d-flex justify-content-center">
              <div
                className="card "
                style={{ width: "20rem", height: "20rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">Prof. Dr. Emre Dinçer</h5>
                  <p className="card-text">I look your ear.</p>
                  <p className="card-text">
                    {" "}
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Ipsa sapiente cupiditate, blanditiis dolorum ex accusantium
                    mollitia quae nesciunt nobis eius, aliquid repudiandae ea
                    dolorem reiciendis
                  </p>
                  <a
                    href="/appointment"
                    className="btn btn-primary custom-btn-width"
                  >
                    Click for appointment
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-5">
            <div className="col-12  d-flex justify-content-center">
              <iframe
                title="map"
                allowfullscreen=""
                width="280rem"
                height="280rem"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                style={{ border: "0" }}
                src={
                  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3058.644723444232!2d32.86586119663828!3d39.94933592489169!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f6476bd34b5%3A0x2ae6221995a93a5!2sHIDIRLIK%20HILL!5e0!3m2!1str!2str!4v1711288855373!5m2!1str!2str"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
