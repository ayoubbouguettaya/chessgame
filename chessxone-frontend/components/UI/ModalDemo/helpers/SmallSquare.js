import React from 'react'

import styles from './small-square.module.css';
import { BLACK, EMPTY } from '../../../../game/constants';

const SmallSquare = ({ bgColor,piece,player,isSelected,isHeilighted ,blur = true,handleClick}) => {
    const bgColorStyles = bgColor === BLACK ? styles.black : styles.white;


    const handleOnClick = () => {
        console.log('handle click',blur)
        if(!blur){
            handleClick()
        }
    }
    return (
        <div
            className={`${styles.small_square}
                         ${bgColorStyles}
                        ${isSelected ? styles.selected : ''}
                        ${isHeilighted ? styles.isHeilighted : ''}
                        ${blur ? styles.blur : ''}
                        `
                    } 
            onClick={handleOnClick}

        >
      {piece !== EMPTY && (<img src={`/pieces/${player}_${piece}.svg`} />)}   
        </div>
    )
}

export default SmallSquare
