import React, {useEffect} from "react";
import useStyles from "./WorkspaceDialog.style";
import {Avatar, TextField, Button, Typography, Grid, Container, Dialog, MenuItem, Chip, InputLabel, Select} from "@material-ui/core";
import AirplayIcon from "@material-ui/icons/Airplay";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import RouterIcon from "@material-ui/icons/Router";
import WeekendIcon from "@material-ui/icons/Weekend";
import PhoneIcon from "@material-ui/icons/Phone";
import HeadsetMicIcon from "@material-ui/icons/HeadsetMic";
import SpeakerPhoneIcon from "@material-ui/icons/SpeakerPhone";
import DirectionsWalkIcon from "@material-ui/icons/DirectionsWalk";
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import {useForm} from "react-hook-form";
import {rules} from "../../../../../validation/workspace";
import {Workspace, WorkspaceStatus, WorkspaceType, Equipment} from "../../../../../types";

type Props = {
  mode: "Edit" | "Add";
  workspace: Workspace;
  close: () => void;
  submit: (formData: Workspace) => void;
}

const getEquipmentIcon = (value: Equipment): React.ReactElement => {
  switch (value) {
    case Equipment.PROJECTOR: return <RouterIcon />;
    case Equipment.MONITOR: return <PersonalVideoIcon />;
    case Equipment.TELEPHONE: return <PhoneIcon />;
    case Equipment.SPEAKERPHONE: return <SpeakerPhoneIcon />;
    case Equipment.STANDING_DESK: return <DirectionsWalkIcon />;
    case Equipment.HEADSET: return <HeadsetMicIcon />;
    case Equipment.COUCH: return <WeekendIcon />;
    default: return <PhonelinkSetupIcon />;
  }
}

const WorkspaceDialog = ({mode, workspace, close, submit}: Props) => {
  const classes = useStyles();
  const {register, errors, setValue, handleSubmit, reset} = useForm<Workspace>();

  useEffect(() => {
    reset({status: workspace.status, type: workspace.type, equipment: workspace.equipment});
  }, []);

  return (
    <Dialog open onClose={close} aria-labelledby="form-dialog-title">
      <Container maxWidth="xs" className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AirplayIcon />
        </Avatar>
        <Typography component="h1" variant="h5">{mode} Workspace</Typography>

        <form className={classes.form} noValidate autoComplete="off" onSubmit={handleSubmit(submit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextField variant="outlined" required fullWidth id="description" label="Description" name="description" autoFocus
                defaultValue={workspace.description} inputRef={register(rules.description)} error={Boolean(errors.description)} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField type="number" variant="outlined" required fullWidth id="size" label="Size" name="size"
                InputProps={{inputProps: {max: 256, min: 1}}}
                defaultValue={workspace.size} inputRef={register(rules.size)} error={Boolean(errors.size)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select variant="outlined" required fullWidth id="status" label="Status" name="status"
                 defaultValue={workspace.status} inputRef={register(rules.status)} error={Boolean(errors.status)} 
                 onChange={e => setValue("status", e.target.value)} >
                {Object.values(WorkspaceStatus).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select variant="outlined" required fullWidth id="type" label="Type" name="type"
                 defaultValue={workspace.type} inputRef={register(rules.type)} error={Boolean(errors.type)} 
                 onChange={e => setValue("type", e.target.value)} >
                {Object.values(WorkspaceType).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="equipmentLabel" className={classes.label}>Equipment</InputLabel>
              <Select multiple fullWidth id="equipment" name="equipment" labelId="equipmentLabel" label="Equipment"
                defaultValue={workspace.equipment} inputRef={register(rules.equipment)} error={Boolean(errors.equipment)} 
                renderValue={selected => <div className={classes.chips}>{(selected as string[]).map((value) => (
                  <Chip key={value} label={value} icon={getEquipmentIcon(value as Equipment)} className={classes.chip} />
                ))}</div>}
                onChange={e => setValue("equipment", e.target.value)} >
                {Object.values(Equipment).map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
              </Select>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button type="submit" fullWidth variant="contained" color="primary">Save</Button>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttons}>
              <Button fullWidth variant="contained" color="primary" onClick={close}>Close</Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Dialog>
  );
}

export default WorkspaceDialog;
