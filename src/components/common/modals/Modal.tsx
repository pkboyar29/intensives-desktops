import { FC, ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import CrossIcon from '../../icons/CrossIcon';

interface ModalProps {
  children: ReactNode;
  title: ReactNode;
  onCloseModal: () => void;
  shouldHaveCrossIcon?: boolean;
  closeByClickOutside?: boolean;
}

const Modal: FC<ModalProps> = ({
  children,
  title,
  onCloseModal,
  shouldHaveCrossIcon = true,
  closeByClickOutside = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMouseDownInside = useRef<boolean>(false);

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
  const modalContent = (
    <div
      onMouseDown={closeByClickOutside ? handleMouseDown : () => {}}
      onMouseUp={closeByClickOutside ? handleMouseUp : () => {}}
      className="fixed top-0 left-0 z-[200] flex items-center justify-center w-full h-full bg-modal_eclipse"
    >
      <div
        ref={modalRef}
        className="w-full px-5 py-6 mx-3 overflow-hidden bg-white border-2 border-solid rounded-xl lg:basis-2/3 xl:basis-1/3 border-another_white"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
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
  return (
    <div
      onMouseDown={closeByClickOutside ? handleMouseDown : () => {}}
      onMouseUp={closeByClickOutside ? handleMouseUp : () => {}}
      className="fixed top-0 left-0 z-[200] flex items-center justify-center w-full h-full bg-modal_eclipse"
    >
      <div
        ref={modalRef}
        className="w-full px-5 py-6 mx-3 overflow-hidden bg-white border-2 border-solid rounded-xl lg:basis-2/3 xl:basis-1/3 border-another_white"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
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
    //ReactDOM.createPortal(modalContent, document.body)
  );
};

export default Modal;
