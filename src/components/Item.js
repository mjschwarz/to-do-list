import React from 'react';

export default function Item({itemData, removeItem}) {
    return (
        <div className="item">
            <p className="taskTitle">{itemData.title}</p>
            <p className="taskDate">{itemData.date.toDateString()}</p>
            <input className="box" type="checkbox" id="complete" onChange={() => removeItem(itemData)} />
        </div>
    );

}