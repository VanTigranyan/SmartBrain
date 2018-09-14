import React, { Component } from "react";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Registration from "./components/Registration/Registration";
import Rank from "./components/Rank/Rank";
import "./App.css";
import Particles from "react-particles-js";



const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      speed: 10
    }
  }
};

const app = new Clarifai.App({
  apiKey: "26c8120c9056421aac50883fa812f7a0"
});


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
      isSignedin: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = data => {
    console.log(data);
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = event => {
    console.log(event.target.value);
    this.setState({
      input: event.target.value
    });
  };

  onButtonSubmit = () => {
    console.log("click");
    this.setState({
      imageUrl: this.state.input
    });

    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:5000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(entries => {
            this.setState(Object.assign(this.state.user, {
              entries: entries
            }))
          })
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(error => console.warn("You have an error -" + error));
  };

  onRouteChange = route => {
    this.setState({ route: route });
    if (route === "signout") {
      this.setState({ isSignedin: false, route: "signin" });
    } else if (route === "home") {
      this.setState({ isSignedin: true });
    }
  };

  render() {
    const { isSignedin, imageUrl, box, route } = this.state;
    return (
      <div className="App">
        <Particles params={particlesOptions} className="particles" />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedin={isSignedin}
        />
        <Logo />

        {route === "home" ? (
          <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Registration loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
