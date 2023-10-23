import React from 'react'
import {BiEdit} from "react-icons/bi"
import {AiFillDelete} from "react-icons/ai"


export const Task = ({text, updateMode, deleteToDo}) => {
  return (
    <div className="task">
        <div className="text">{ text }</div>
        <div className="icons">
          <BiEdit className="icon" onClick={updateMode}/>
          <AiFillDelete className="icon" onClick={deleteToDo}/>
        </div>
    </div>
  )
}

