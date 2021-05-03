import React, {useEffect, useState} from 'react';
import {Typography, Container, Box} from '@material-ui/core';
import Headline from '../../components/Layout/components/Main/Headline/Headline';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import useFormStyles from '../../styles/form';

function Page404() {
  const formStyles = useFormStyles();
  const [faceCount, setFaceCount] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(() => setFaceCount((oldCount) => (oldCount < 100 ? oldCount + 1 : 0)), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Container maxWidth="lg" className={formStyles.paper}>
      <Headline pagename="Error 404" />
      <Typography color="primary" component="h1" variant="h2">
        The page is not found... Sorry!
      </Typography>
      <Box m={3}>
        {[...Array(faceCount)].map((v, i) => (
          <MoodBadIcon key={i} />
        ))}
      </Box>
    </Container>
  );
}

export default Page404;
