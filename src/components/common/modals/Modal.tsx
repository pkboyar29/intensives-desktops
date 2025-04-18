import { FC, ReactNode, useEffect, useRef } from 'react';

import CrossIcon from '../../icons/CrossIcon';

interface ModalProps {
  children: ReactNode;
  title: ReactNode;
  onCloseModal: () => void;
  shouldHaveCrossIcon?: boolean;
}

const Modal: FC<ModalProps> = ({
  children,
  title,
  onCloseModal,
  shouldHaveCrossIcon = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMouseDownInside = useRef<boolean>(false);

  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (modalRef.current?.contains(event.target as Node)) {
      isMouseDownInside.current = true;
    } else {
      isMouseDownInside.current = false;
    }
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      !isMouseDownInside.current &&
      !modalRef.current?.contains(event.target as Node)
    ) {
      onCloseModal();
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="fixed top-0 left-0 z-[200] flex items-center justify-center w-full h-full bg-modal_eclipse"
    >
      <div
        ref={modalRef}
        className="px-5 py-6 mx-3 overflow-hidden bg-white border-2 border-solid rounded-xl lg:basis-1/3 border-another_white"
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="text-xl font-bold">{title}</div>
          {shouldHaveCrossIcon && (
            <button onClick={onCloseModal}>
              <CrossIcon />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
