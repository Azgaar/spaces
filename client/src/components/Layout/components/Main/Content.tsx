import React, {FC} from 'react';
import {Box, Container, Paper} from '@material-ui/core';
import Headline from './Headline/Headline';
import useStyles from './Content.style';

type ContentProps = {
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  marginTop?: number;
  pagename: string;
};

const Content: FC<ContentProps> = ({children, maxWidth, marginTop = 10, pagename}) => {
  const classes = useStyles();

  return (
    <Container component="main" role="main" maxWidth={maxWidth}>
      <Box mt={marginTop}>
        <Paper elevation={4} className={classes.paper}>
          <Headline pagename={pagename} />
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default Content;
