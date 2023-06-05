import React from "react";

const ProgressBar = (props) => {
  const {  completed } = props;

  const containerStyles = {
    height: 12,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 0
  }

  const fillerStyles = {
    height: '100%',
    width: `${completed}%`,
    backgroundColor: "#A30000",
    borderRadius: 'inherit',
    textAlign: 'right'
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}></span>
      </div>
    </div>
  );
};
export default ProgressBar;