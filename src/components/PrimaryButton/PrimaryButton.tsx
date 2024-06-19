import './PrimaryButton.css'
import { FC } from 'react'

type PrimaryButtonProps = {
    text: string,
    width?: number,
    height?: number,
    onClick: () => void
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ text, width, height, onClick }) => {
    
    return (
       <>
        <button className='primary-button' onClick={onClick}>{text}</button>      
       </>
    )
 }

 export default PrimaryButton;
