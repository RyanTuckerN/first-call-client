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

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FunctionComponent<NotificationsProps> = ({
  notifications,
}) => {
  const mapper = (notifications: Notification[]): any =>
    notifications.map((n, i) => {console.log(n,i); 
      return (
      
      <MenuList key={n.id}>
        <MenuItem dense style={{ whiteSpace: "normal" }}>
          <ListItemText>
            <Typography  variant="inherit" sx={{fontSize:11, float: 'right', marginLeft: 10}}>{n.details.sender}</Typography>
            <div/>
            <Typography variant="inherit">{n.text}</Typography>
            <Typography variant="overline">{n.createdAt && new Date(n.createdAt).toLocaleDateString()}</Typography>

          </ListItemText>
        </MenuItem>
        {i < notifications.length - 1 && <Divider />}
      </MenuList>
    )});

  return <Paper sx={{ maxWidth: 400 }}>{mapper(notifications)}</Paper>;
};

export default Notifications;
