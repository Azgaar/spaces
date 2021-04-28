import React, {useState} from "react";
import useStyles from "./Requests.style";
import {Container, Box, ButtonGroup, Button} from "@material-ui/core";
import Headline from "../../../components/Layout/components/Main/Headline/Headline";
import RequestList from "./RequestList/RequestList";
import {ServiceRequestStatus} from "../../../types";

function Requests() {
  const classes = useStyles();
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus>(ServiceRequestStatus.PENDING);

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Headline pagename="Manage Service Requests" />
      <Box className={classes.topControlSection}>
        <ButtonGroup variant="contained" color="secondary">
          {Object.values(ServiceRequestStatus).map(status => (
            <Button key={status} onClick={() => setStatusFilter(() => status)} className={statusFilter === status ? classes.selectedButton : ""}>
              {status}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <RequestList status={statusFilter} />
    </Container>
  );
}

export default Requests;
