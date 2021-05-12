import React, {useEffect, useState, FC} from 'react';
import {Typography, Box} from '@material-ui/core';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import Content from '../../components/Layout/components/Main/Content';

const Page404: FC = () => {
  const [faceCount, setFaceCount] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(() => setFaceCount((oldCount) => (oldCount < 80 ? oldCount + 1 : 0)), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Content maxWidth="xs" pagename="Error 404">
      <Box m={3} display="flex" justifyContent="center">
        <Typography color="primary" component="h1" variant="subtitle1">
          The page is not found... Sorry!
        </Typography>
      </Box>
      <Box m={3} px={3}>
        {[...Array(faceCount)].map((v, i) => (
          <MoodBadIcon key={i} />
        ))}
      </Box>
    </Content>
  );
};

export default Page404;
