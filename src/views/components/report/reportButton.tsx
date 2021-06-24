import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import styled from 'styled-components';

import ReportModal from './reportModal';

const StyledReportButton = styled.div`
  color: black;
  font-weight: bold;

  // rem so that global font size doesn't affect this
  font-size: 2rem;

  background: orange;
  border: 1px solid lightcoral;
  width: 30px;
  height: 30px;
  border-radius: 50%;

  &:hover {
    background: #f09b00;
  }

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReportButton: React.FC = () => {
  const [modalState, setModalState] = useState(false);

  return (
    <StyledReportButton
      onClick={() => {
        setModalState(!modalState);
      }}
    >
      !{modalState ? <ReportModal /> : null}
    </StyledReportButton>
  );
};

export default hot(ReportButton);
