import { FC, createContext, ReactNode } from 'react';

import { EducationRequest } from '../ts/types/EducationRequest';

export const EducationRequestsContext = createContext<EducationRequest[]>([]);

interface EducationRequestsContextProviderProps {
  educationRequests: EducationRequest[];
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
