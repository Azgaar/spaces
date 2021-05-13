import React, {FC} from 'react';
import Content from '../../../components/Layout/components/Main/Content';
import ReservationsList from './ReservationsList/ReservationsList';

const ReservationsHistory: FC = () => {
  return (
    <Content maxWidth="md" pagename="Reservations History">
      <ReservationsList active={false} />
    </Content>
  );
};

export default ReservationsHistory;
