import * as React from "react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { Notification } from "../../../types/API.types";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { HashLink as Link } from "react-router-hash-link";
import {
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import {
  MailOutlineOutlined,
  ReportOutlined,
  CelebrationOutlined,
  InsertInvitationOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
  HighlightOffOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";
import { fetchHandler } from "../../_helpers/fetchHandler";
import API_URL from "../../_helpers/environment";
import { UserCtx } from "../../Context/MainContext";

interface NewMessageProps {
  open: boolean;
  to: string;
  handleClose: any
}

const NewMessage: React.FunctionComponent<NewMessageProps> = ({ open, to, handleClose }) => {
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewMessage;
