import * as React from "react";
import { Component } from "react";
import { Gig, CallStack, Post } from "../../../../../../types/API.types";
import { DetailedGig } from "../../Gig.types";
import { Prompt } from "react-router-dom";
import {
  FormControl,
  FormHelperText,
  Input,
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Snackbar,
  Alert,
  List,
  IconButton,
} from "@mui/material";
import {
  Settings,
  AttachMoney,
  LocationOn,
  CalendarToday,
  ChevronRight,
  CheckCircleOutline,
  Circle,
  ErrorOutline,
  Add,
  // Circle
} from "@mui/icons-material";

interface GigEditProps extends Gig {
  details: DetailedGig;
}

interface GigEditState {
  id: number;
  ownerId: number;
  description: string;
  location: string;
  date: string; //date format
  payment: number;
  token: string; //uuid
  openCalls: string[];
  photo?: string;
  optionalInfo?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
  posts?: Post[];
  callStack?: CallStack;
  optionalKey?: string;
  optionalVal?: string
}

class GigEdit extends Component<GigEditProps, GigEditState> {
  constructor(props: GigEditProps) {
    super(props);
    this.state = { ...this.props };
  }
  render() {
    return (
      <>
        <Grid container spacing={0} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Details</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Title</Typography>

            <TextField
              fullWidth
              placeholder="Wedding gig, Corporate event, etc... "
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Pay</Typography>
            <AttachMoney />
            <Input type="number" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Date and Time</Typography>
            <CalendarToday />
            <Input type="datetime-local" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Location</Typography>
            {/* <LocationOn /> */}
            <TextField
              fullWidth
              placeholder='Address or venue, eg. "Biltwell Event Center"'
            />
          </Grid>
            <Typography variant="h6">Optional Details</Typography>
          <Grid container justifyContent='space-between' item xs={12}>
            <IconButton>
              <Add />
            </IconButton>
            <Grid item xs={3}>
              <TextField placeholder='Meal'></TextField>
            </Grid>
            <Typography variant='h4'>:</Typography>
            <Grid item xs={6}>
              <TextField fullWidth placeholder='Surf and turf'></TextField>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default GigEdit;
