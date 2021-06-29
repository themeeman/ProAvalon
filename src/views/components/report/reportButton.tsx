import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';

import ReportModal from './reportModal';

const StyledReportButton = styled.div`
  color: black;
  font-weight: bold;

  // rem so that global font size doesn't affect this
  font-size: 1.7rem;

  background: orange;
  border: 1px solid lightcoral;
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;

  &:hover {
    background: #f09b00;
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReportButton: React.FC = () => {
  const [modalIsOpen, setModalState] = useState(false);

  const toggleModal = () => {
    setModalState(!modalIsOpen);
  };

  const closeModal = () => {
    setModalState(false);
  };

  return (
    <>
      <StyledReportButton onClick={toggleModal}>!</StyledReportButton>
      <ReportModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
    </>
  );
};

export default hot(ReportButton);
