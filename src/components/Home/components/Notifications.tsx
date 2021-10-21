import * as React from "react";
import { Notification } from "../../../types/API.types";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
import {Link} from 'react-router-dom'
// import Check from "@mui/icons-material/Check";
import { Typography, Box, IconButton, List, ListItem, ListItemText } from "@mui/material";
import {
  MailOutlineOutlined,
  ReportOutlined,
  CelebrationOutlined,
  InsertInvitationOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
  HighlightOffOutlined,
} from "@mui/icons-material";
import { fetchHandler } from "../../_helpers/fetchHandler";
import API_URL from "../../_helpers/environment";

interface NotificationsProps {
  notifications: Notification[];
  setHomeState: (key: string, value: any) => void;
}

const Notifications: React.FunctionComponent<NotificationsProps> = ({
  notifications,
  setHomeState
}) => {
  const invite = "#2374D2";
  const hash: any = {
    "100": { color: invite, icon: <InsertInvitationOutlined /> },
    "200": {
      color: "#ff9800",
      icon: <SentimentVeryDissatisfiedOutlined color="warning" />,
    },
    "201": { color: "#66bb6a", icon: <SentimentVerySatisfiedOutlined /> },
    "300": { color: "#66bb6a", icon: <CelebrationOutlined color="success" /> },
    "301": { color: "#f44336", icon: <ReportOutlined color="error" /> },
    "400": { color: "", icon: <MailOutlineOutlined /> },
  };

  const mapper = (notifications: Notification[]): any =>
    notifications.map((n, i) => {
      const { code } = n.details;

      const handleDelete = async (): Promise<boolean | null> => {
        const json = await fetchHandler({
          url: `${API_URL}/notification/${n.id}`,
          method: "delete",
          auth: localStorage.getItem('token') ?? ''
        });
        alert(json.message)
        json.success && setHomeState('notifications', json.notifications)
        return json.success;
      };

      return (
        <List key={n.id}>
          <ListItem dense style={{ whiteSpace: "normal" }}>
            <ListItemText
              style={{
                // marginLeft: 15,
                padding: 8,
                borderRadius: 25,
                background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, ${
                  hash[code.toString()].color
                }30 0%, rgba(255,255,255,0) 100%)`,
              }}
            >
              <Link to={`/main/gig/${n.details.gigId}`}>{hash[code.toString()].icon}</Link>
              <IconButton sx={{ float: "right", marginLeft: 10 }} onClick={handleDelete}>
                <HighlightOffOutlined fontSize="small" />
              </IconButton>
              {/* <Typography
                variant="inherit"
                sx={{ fontSize: 11, float: "right", marginLeft: 10 }}
              >
                {n.details.sender}
              </Typography> */}
              <div />
              <Typography variant="inherit">{n.text}</Typography>
              <Typography variant="overline">
                {n.createdAt && new Date(n.createdAt).toLocaleDateString()}
              </Typography>
            </ListItemText>
          </ListItem>
          {i < notifications.length - 1 && <Divider />}
        </List>
      );
    });

  return <Paper>{mapper(notifications)}</Paper>;
};

export default Notifications;
