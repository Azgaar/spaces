import React, {FC} from 'react';
import {Container, Paper} from '@material-ui/core';
import useFormStyles from '../../../../styles/form';
import Headline from './Headline/Headline';

type ContentProps = {
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pagename: string;
};

const Content: FC<ContentProps> = ({children, maxWidth, pagename}) => {
  const formStyles = useFormStyles();

  return (
    <Container maxWidth={maxWidth}>
      <Paper elevation={4} className={formStyles.paper}>
        <Headline pagename={pagename} />
        {children}
      </Paper>
    </Container>
  );
};

export default Content;
