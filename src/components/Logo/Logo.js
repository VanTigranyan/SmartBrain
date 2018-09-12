import React from "react";
import Tilt from "react-tilt";
import brain from './brain.png';
import './stylesheet.css';
import './Logo.css';

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt tilt"
        options={{ max: 55 }}
        style={{ height: 200, width: 200 }}
      >
        <div className="Tilt-inner pa3">
            <img src={brain} alt=""/>
            <h2>SmartBrain</h2>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
