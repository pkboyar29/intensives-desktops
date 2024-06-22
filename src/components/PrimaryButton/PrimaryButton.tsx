
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
        <button className='text-white bg-blue font-l py-3 px-5  rounded-xl' onClick={onClick}>{text}</button>      
       </>
    )
 }

 export default PrimaryButton;
