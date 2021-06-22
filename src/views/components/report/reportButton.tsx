import React, { useState } from 'react';
import { hot } from 'react-hot-loader/root';
import ReportModal from './reportModal';

declare const socket: any;

const divStyle = {
  color: 'red',
};

// const ReportButton: React.FC<Props> = (props) => {

const ReportButton: React.FC = () => {
  const [modalState, setModalState] = useState(false);

  return (
    <div
      style={divStyle}
      onClick={() => {
        setModalState(!modalState);
        socket.emit('allChatFromClient', {
          message: 'asdf',
        });
      }}
    >
      R{modalState ? <ReportModal /> : null}
    </div>
  );
};

export default hot(ReportButton);
