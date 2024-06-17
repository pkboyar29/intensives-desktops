import { FC } from 'react'

interface TitleProps {
   text: string
}

const Title: FC<TitleProps> = ({ text }) => {
   return (
      <h1 className='font-bold font-sans text-3xl mt-3'>{text}</h1>
   )
}

export default Title