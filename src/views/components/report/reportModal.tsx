import React from 'react';
import Modal from 'react-modal';

import ReportForm from './reportForm';

interface ReportModalProps {
  modalIsOpen: boolean;
  closeModal: () => void;
}

const customStyles = {
  content: {
    top: '20%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const ReportModal: React.FC<ReportModalProps> = ({
  modalIsOpen,
  closeModal,
}) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <button onClick={closeModal}>close</button>
      <div>I am a modal</div>
      <ReportForm />
    </Modal>
  );
};

export default ReportModal;
