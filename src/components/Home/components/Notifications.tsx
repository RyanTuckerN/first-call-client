import * as React from "react";
import { Notification } from "../../../types/API.types";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import Check from "@mui/icons-material/Check";
import { Typography } from "@mui/material";
import {
  MailOutlineOutlined,
  ReportOutlined,
  CelebrationOutlined,
  InsertInvitationOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from "@mui/icons-material";

interface NotificationsProps {
  notifications: Notification[];

}

const Notifications: React.FunctionComponent<NotificationsProps> = ({
  notifications,
}) => {
  const invite = "#2374D2"
  const hash: any = {
    "100": { color: invite, icon: <InsertInvitationOutlined /> },
    "200": { color: '#ff9800', icon: <SentimentVeryDissatisfiedOutlined color='warning' /> },
    "201": { color: '#66bb6a', icon: <SentimentVerySatisfiedOutlined /> },
    "300": { color: "#66bb6a", icon: <CelebrationOutlined color="success" /> },
    "301": { color: "#f44336", icon: <ReportOutlined color="error" /> },
    "400": { color: '', icon: <MailOutlineOutlined /> },
  };

  const mapper = (notifications: Notification[]): any =>
    notifications.map((n, i) => {
      // console.log(n,i);
      const { code } = n.details;

      return (
        <MenuList  key={n.id}>
          <MenuItem dense style={{ whiteSpace: "normal" }}>
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
              {hash[code.toString()].icon}
              <Typography
                variant="inherit"
                sx={{ fontSize: 11, float: "right", marginLeft: 10 }}
              >
                {n.details.sender}
              </Typography>
              <div />
              <Typography variant="inherit">{n.text}</Typography>
              <Typography variant="overline">
                {n.createdAt && new Date(n.createdAt).toLocaleDateString()}
              </Typography>
            </ListItemText>
          </MenuItem>
          {i < notifications.length - 1 && <Divider />}
        </MenuList>
      );
    });

  return <Paper >{mapper(notifications)}</Paper>;
};

export default Notifications;
