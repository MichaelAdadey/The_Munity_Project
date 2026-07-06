/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

const Button = ({name, onclick, buttonStyles, styles, icon}: any) => {
  return (
    <div className={`${styles}`}>
        <button onClick={onclick} className={`${buttonStyles} h-13 rounded-full`}>
            {name}
            {icon}
        </button>
    </div>
  )
}

export default Button