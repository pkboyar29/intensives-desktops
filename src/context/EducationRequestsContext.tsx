import { FC, createContext, ReactNode } from 'react';

import { IEducationRequest } from '../ts/interfaces/IEducationRequest';

export const EducationRequestsContext = createContext<IEducationRequest[]>([]);

interface EducationRequestsContextProviderProps {
  educationRequests: IEducationRequest[];
  children: ReactNode;
}

const EducationRequestsProvider: FC<EducationRequestsContextProviderProps> = ({
  educationRequests,
  children,
}) => {
  // можно прописать дополнительную бизнес логику (например, методы удаления, добавления) и передать методы в value, также надо будет создать состояние intensives, чтобы оно внутри провайдера изменялось
  // ну и соответственно надо будет дополнительно тип у контекста изменить, потому что там будут не только intensives
  return (
    <EducationRequestsContext.Provider value={educationRequests}>
      {children}
    </EducationRequestsContext.Provider>
  );
};

export default EducationRequestsProvider;
