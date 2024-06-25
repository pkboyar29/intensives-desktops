import { Link } from 'react-router-dom'
import SideMenu from '../components/SideMenu'
import arrow from '../icons/ArrowRight.svg'

const ManageMenu = () => {
    return (
        <div className='body'>
            <SideMenu />
            <div className='main-block'>
                <div className='center-block'>
                    <div className='flex flex-col flex-wrap'>
                        <div className='title font-32'>Редактирование списков</div>
                        <div className='grid manageMenu'>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Роли студентов</h2>
                                <Link to={'/editRoles'} className='color-title font-14 p-2 flex align-center gap'>
                                    Перейти к редактированию
                                    <img
                                        height={10}
                                        width={13}
                                        loading='lazy'
                                        src={arrow}
                                        className='aspect-[0.96] fill-black'
                                    />
                                </Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Студенты</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Профили подготовки</h2>
                                <Link to={'/editProfile'} className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Потоки</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Группы</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Аудитории</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Преподаватели</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                            <div className='border border-radius p-4'>
                                <h2 className='font-18 bold-font'>Специализации</h2>
                                <Link className='color-title font-14 p-4'>Перейти к редактированию</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageMenu