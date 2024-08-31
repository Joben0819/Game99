import { DialogHTMLAttributes, ReactNode, RefObject, forwardRef, useCallback } from 'react';

type IModalComponentProps = DialogHTMLAttributes<HTMLDialogElement> & {
  children: ReactNode;
};

const ModalComponent = forwardRef<HTMLDialogElement, IModalComponentProps>(({ children, ...props }, ref) => {
  return (
    <dialog
      ref={ref}
      {...props}
    >
      {children}
    </dialog>
  );
});
ModalComponent.displayName = 'Modal';

export const useModal = (modalRef: RefObject<HTMLDialogElement>) => {
  const openModal = useCallback(() => {
    const modal = modalRef.current;
    if (modal) {
      modal.showModal();
    }
  }, [modalRef.current]);
  const closeModal = useCallback(() => {
    const modal = modalRef.current;
    if (modal) {
      modal.close();
    }
  }, [modalRef.current]);
  return {
    openModal,
    closeModal,
    Modal: ModalComponent,
  };
};
