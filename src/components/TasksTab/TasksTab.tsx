import './TasksTab.css'
import React, { useState } from 'react'

type TasksTabProps = {
    onTabChange: (selectedTab: number) => void
}

export default function TasksTab(props: TasksTabProps) {
    const [activeTab, setActiveTab] = useState<number>();

    function handleTab(tabId: number) {
        setActiveTab(tabId);
        props.onTabChange(tabId);

    }
    return(
    <div className='tab-container'>
        <div
        className={`tab ${activeTab == 0 ? 'active' : ''}`}
        onClick={() => handleTab(0)}
      >
        All
      </div>
      <div
        className={`tab ${activeTab == 1 ? 'active' : ''}`}
        onClick={() => handleTab(1)}
      >
        InProgress
      </div>
      <div
        className={`tab ${activeTab == 2 ? 'active' : ''}`}
        onClick={() => handleTab(2)}
      >
        To do
      </div>
    </div>
    )
}