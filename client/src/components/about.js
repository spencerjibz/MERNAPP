import React, { Component } from "react";
export class about extends Component {
  componentDidMount() {
    let scp = document.getElementById("prof-script");

    scp.async = true;
  }
  starter() {
    function LoadWin(cb) {
      cb();
    }
    LoadWin(() => window.location.reload(true));
  }

  render() {
    return (
      <div>
        <div className=" container-fluid">
          <div className="jumbotron">
            <div id="mist" className="container">
              <p id="intro">
                USE THE SELECTOR BELOW TO CHECK OUT ANY OF THE FEATURES OF YOUR
                CHOICE. <br />
                REFRESH THE PAGE TO RESET TO THE DEFAULT VIEW ON USING THE
                SELECTOR FOR FILES AND THE WEBCAM{" "}
              </p>
              <br />
              <button
                className="btn-secondary"
                id="starter"
                onClick={this.starter.bind(this)}
              >
                {" "}
                Click to start{" "}
              </button>
              <br />

              <select id="mysel">
                <option value="DEFAULT">DEFAULT</option>
                <option value="LIST EDITOR">LIST EDITOR</option>
                <option value="MEDIA PLAYER">MEDIA PLAYER</option>
                <option value="WEBCAM">WEB CAM </option>
                <option value="watch">MY TIME</option>
              </select>

              <div className="form-input">
                <div id="inp_stuff">
                  <label id="labe">ITEM:</label>
                  <input
                    type="text"
                    id="inp"
                    className="col-lg-5  form-item"
                  />{" "}
                  <br />
                </div>

                <div id="buts">
                  <input type="button" value="ADD TO LIST" id="btn" />
                  <input type="button" value="REMOVE ITEMS" id="btn2" />
                  <input type="button" value="ACCESS WEB CAM" id="btn3" />
                  <br />

                  <h2 className="res"> LIST</h2>
                </div>
              </div>

              <ul id="thelist"></ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default about;
