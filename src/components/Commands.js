import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import SideMenu from './SideMenu'

class Commands extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div className='body'>
      <SideMenu />
      <div className='main-block'>
        <div className='center-block'>
          <div className='font-roboto bg-[#F9FAFB] min-h-screen'>
            <div className='bg-[#FFFFFF] p-6'>
              <div className='title'>
                <div className='font-32'>Команды</div>
              </div>
              <h2 className='text-lg bold-font podtitle'>Созданные команды</h2>
              <div className='flex flex-wrap'>
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className='bg-white p-4 rounded-lg space-y-4'>
                    <div className='flex content-center gap'>
                      <div className='img-command'></div>
                      <h3 className='podtitle font-16'>Команда 1</h3>
                    </div>
                    <div className='block-student'>
                      {Array.from({ length: 7 }).map((_, innerIndex) => (

                        <div key={innerIndex} className='flex items-center p-1 gap'>
                          <div className='background-color-E8EDF2 p-1 border-radius'>
                            П
                          </div>
                          <span className='background-color-E8EDF2 p-1 border-radius'>
                            20-ИСбо-2 Мындрила М.А.
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex'>
                <button className='button-classic'><Link to={`/createCom`}>
                  Изменить состав команд</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default Commands