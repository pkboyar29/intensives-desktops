import { FC, ReactNode, useEffect } from 'react';

import CrossIcon from '../icons/CrossIcon';

interface ModalProps {
  children: ReactNode;
  title: ReactNode;
  onCloseModal: () => void;
}

const Modal: FC<ModalProps> = ({ children, title, onCloseModal }) => {
  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleOutsideClick = () => {
    onCloseModal();
  };

  const handleInsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-modal_eclipse"
    >
      <div
        onClick={handleInsideClick}
        className="px-5 py-6 overflow-hidden bg-white border-2 border-solid rounded-xl basis-1/3 border-another_white"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="text-xl font-bold">{title}</div>
          <button onClick={onCloseModal}>
            <CrossIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
