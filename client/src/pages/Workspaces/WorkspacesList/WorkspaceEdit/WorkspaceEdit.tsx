import React from "react";
import useStyles from "./WorkspaceEdit.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, Select, MenuItem} from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import {useForm, SubmitHandler} from "react-hook-form";
import {rules} from "../../../../validation/workspace";
import {useRequest} from "../../../../hooks";
import {Workspace, WorkspaceStatus} from "../../../../types";
import {MessageType, useMessage} from "../../../../components/providers/MessageProvider";
import {WorkspaceService} from "../../../../services";

type Props = {
  open: boolean;
  workspace: Workspace;
  closeDialog: () => void;
}

const WorkspaceEdit = ({open, workspace, closeDialog}: Props) => {
  const classes = useStyles();
  const {handleRequest} = useRequest();
  const {pushMessage} = useMessage();
  const {register, errors, setValue, handleSubmit} = useForm<Workspace>();

  const onSubmit: SubmitHandler<Workspace> = async (formData: Workspace) => {
    console.log(formData);
    const res = await handleRequest(WorkspaceService.update(formData));
    if (!res) return;
    pushMessage({title: "Workspace is updated", type: MessageType.SUCCESS});
  };

  return (
    <Dialog open={open} onClose={closeDialog} aria-labelledby="form-dialog-title">
      <Container maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AirplayIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Edit Workspace</Typography>

        <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="description" label="Title" name="title" autoFocus
                defaultValue={workspace.description} inputRef={register(rules.description)} error={Boolean(errors.description)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select variant="outlined" required fullWidth id="status" label="Status" name="status"
                 defaultValue={workspace.status} inputRef={register(rules.status)} error={Boolean(errors.status)} 
                 onChange={e => setValue("status", e.target.value)} >
                {Object.values(WorkspaceStatus).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField variant="outlined" required fullWidth id="type" label="Type" name="type"
                defaultValue={workspace.type} inputRef={register(rules.type)} error={Boolean(errors.type)} />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth id="size" label="Size" name="size"
                defaultValue={workspace.size} inputRef={register(rules.size)} error={Boolean(errors.size)} />
            </Grid>
            <Grid item xs={12}>
              <TextField variant="outlined" required fullWidth name="equipment" label="Equipment" id="equipment"
                defaultValue={workspace.equipment} inputRef={register(rules.equipment)} error={Boolean(errors.equipment)} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button fullWidth variant="contained" color="primary" onClick={closeDialog}>Close</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Dialog>
  );
}

export default WorkspaceEdit;
