import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { HashCode } from "../Gig.types";
import GigDashBoard from "./GigDashboard";
import Notifications from "../../../components/Notifications";
import GigSidebar from './GigSidebar'

interface GigWelcomeProps extends GigIndexState {}

const GigWelcome: React.FunctionComponent<GigWelcomeProps> = (
  props: GigWelcomeProps
) => {
  const { user, notifications, messageCode, setGigState } = props;

  return (
    <>
      <Typography variant="h5" paddingBottom={3}>
        {`Welcome back, ${user.name.split(" ")[0]}!`}
      </Typography>
      <GigDashBoard {...props} />
      <Grid container spacing={2} >
        <Grid item xs={3} sm={3} >
          <GigSidebar {...props}/>
        </Grid>
        <Grid item xs={9} sm={9}>
          <Box display='flex' justifyContent='flex-end'>
            <Button onClick={() => setGigState("messageCode", null)}>
              show all notifications
            </Button>
          </Box>
          <Notifications
            notifications={filterNotifications(messageCode, notifications)}
          />
        </Grid>
      </Grid>
    </>
  );
};

const filterNotifications = (
  code: number | null,
  notifications: Notification[]
): Notification[] => {
  if (!code) return notifications;
  return notifications.filter(
    (n) => n.details.code === code || n.details.code === code + 1
  );
};

export default GigWelcome;
