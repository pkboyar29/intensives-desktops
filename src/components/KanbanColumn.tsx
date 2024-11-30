import { FC } from 'react';

interface KanbanColumnProps {
    title: string;
    colorHEX: string;
}

const KanbanColumn: FC<KanbanColumnProps> = ({ title, colorHEX }) => {

    return(
        <div className="w-80 p-4 bg-red-100 rounded-lg shadow-md border-t-4"
        style={{ borderTopColor: colorHEX }}>
            
            <div className='flex flex-row items-start justify-between'>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                </div>
                
                <button className='text-xl hover:text-dark_blue'>
                    ...
                </button>
            </div>
            <button className="w-full text-left text-blue hover:text-dark_blue">
                + Создать задачу
            </button>

            <div className="space-y-2">
                zadachi tut
            </div>
            
        </div>      
    )
}

export default KanbanColumn;