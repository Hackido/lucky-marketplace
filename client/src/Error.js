import React, { useState, useEffect } from "react";

function Error(props) {
  let result;

  if (props.message !== null) {
    result = (
      <div className="notification is-danger">
        <button className="delete"></button>
        {props.message}
      </div>
    )
  } else {
    result = (<></>)
  }

  return result
}

export default Error;