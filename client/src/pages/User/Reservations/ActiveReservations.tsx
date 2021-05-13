import React, {FC} from 'react';
import Content from '../../../components/Layout/components/Main/Content';
import ReservationsList from './ReservationsList/ReservationsList';

const ActiveReservations: FC = () => {
  return (
    <Content maxWidth="md" pagename="Active Reservations">
      <ReservationsList active={true} />
    </Content>
  );
};

export default ActiveReservations;
