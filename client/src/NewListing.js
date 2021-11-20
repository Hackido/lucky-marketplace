import React, { useState, useEffect } from "react";

function NewListing() {
  return (
    <div className="box">
      <div className="field">
        <label htmlFor="item-description" className="label">Description</label>
        <div className="control">
          <input type="text" name="item-description" className="input textarea"/>
        </div>
      </div>

      <div className="field">
        <label htmlFor="item-image" className="label">Image</label>
        <div className="control">
          <input type="file" name="item-image" accept="image/* multiple" className="input"/>
        </div>
      </div>

      <div className="field">
        <label htmlFor="location" className="label">Location</label>
        <div className="control">
          <input type="text" name="location" className="input"/>
        </div>
      </div>
      
      <div className="field">
        <label htmlFor="price" className="label">Price (ETH)</label>
        <div className="control">
          <input type="number" name="price" className="input"/><i>(requires collateral)</i>
        </div>
      </div>
      
      <div className="field">
        <label htmlFor="slots" className="label">Slots</label>
        <div className="control">
          <input type="number" name="slots" className="input"/>
        </div>
      </div>

      <button className="button is-primary is-outlined">Create Listing</button>
    </div>
  )
}

export default NewListing;