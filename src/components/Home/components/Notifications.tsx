import * as React from "react";
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
} from "@mui/material";
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
import { UserCtx } from "../../Context/MainContext";

interface NotificationsProps {
  notifications: Notification[];
  setHomeState: (key: string, value: any) => void;
}

const Notifications: React.FunctionComponent<NotificationsProps> = ({
  notifications,
  setHomeState,
}) => {
  const context = useContext(UserCtx);
  const invite = "#2374D2";
  const hash: any = {
    "100": {
      color: invite,
      icon: <InsertInvitationOutlined color="primary" />,
    },
    "200": {
      color: "#ff9800",
      icon: <SentimentVeryDissatisfiedOutlined color="warning" />,
    },
    "201": {
      color: "#66bb6a",
      icon: <SentimentVerySatisfiedOutlined color="success" />,
    },
    "300": { color: "#66bb6a", icon: <CelebrationOutlined color="success" /> },
    "301": { color: "#f44336", icon: <ReportOutlined color="error" /> },
    "400": { color: "", icon: <MailOutlineOutlined color="primary" /> },
  };

  const mapper = (notifications: Notification[]): any =>
    notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((n, i) => {
        const { code } = n.details;

        const handleDelete = async (): Promise<boolean | null> => {
          const json = await fetchHandler({
            url: `${API_URL}/notification/delete/${n.id}`,
            method: "delete",
            auth: localStorage.getItem("token") ?? context?.token ?? "",
          });
          context?.handleSnackBar(
            json.message,
            json.success ? "success" : "warning"
          );
          json.success && setHomeState("notifications", json.notifications);
          return json.success;
        };

        return (
          <React.Fragment key={n.id}>
            <ListItem dense style={{ whiteSpace: "normal" }}>
              <ListItemText
                style={{
                  borderRadius: 25,
                }}
              >
                <div>
                  <Link
                    smooth
                    to={
                      n.details.gigId
                        ? `/main/gig/${n.details.gigId}#gig-anchor`
                        : ``
                    }
                  >
                    {hash[code.toString()].icon}
                  </Link>
                  <Typography
                    variant="overline"
                    sx={{ position: "relative", bottom: 4, left: 5 }}
                  >
                    {n.createdAt && new Date(n.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <IconButton
                  sx={{ float: "right", marginLeft: 10 }}
                  onClick={handleDelete}
                >
                  <HighlightOffOutlined fontSize="small" />
                </IconButton>
                <div />
                <Typography variant="inherit">
                  {n.details.subject
                    ? `New message from ${n.details.sender}!`
                    : n.text}
                </Typography>
              </ListItemText>
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      });

  return (
    <Paper
      sx={{ width: "100%", height: "calc(100% - 26px)", overflowY: "auto" }}
    >
      <List sx={{ maxHeight: "100%", p: 0 }}>{mapper(notifications)}</List>
    </Paper>
  );
};

export default Notifications;
