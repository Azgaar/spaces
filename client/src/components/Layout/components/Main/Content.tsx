import React, {FC} from 'react';
import {Container, Paper} from '@material-ui/core';
import Headline from './Headline/Headline';
import useStyles from './Content.style';

type ContentProps = {
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pagename: string;
};

const Content: FC<ContentProps> = ({children, maxWidth, pagename}) => {
  const classes = useStyles();

  return (
    <Container maxWidth={maxWidth}>
      <Paper elevation={4} className={classes.paper}>
        <Headline pagename={pagename} />
        {children}
      </Paper>
    </Container>
  );
};

export default Content;
