import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Grid, Paper, Typography } from "@mui/material";
import { HashCode } from "../Gig.types";

interface GigDashBoardProps extends GigIndexState {}

const GigDashBoard: React.FunctionComponent<GigDashBoardProps> = (
  props: GigDashBoardProps
) => {
  const { notificationsHash } = props;

  return (
    <Grid
      container
      spacing={2}
      padding={1}
      display="flex"
      justifyContent="space-around"
    >
      <NotificationMapper
        code={"100"}
        notifications={notificationsHash["100"] ?? []}
      />
      <NotificationMapper
        code={"200"}
        notifications={[
          ...(notificationsHash["200"] ?? []),
          ...(notificationsHash["201"] ?? []),
        ]}
      />
      <NotificationMapper
        code={"300"}
        notifications={[
          ...(notificationsHash["300"] ?? []),
          ...(notificationsHash["301"] ?? []),
        ]}
      />
      <NotificationMapper
        code={"400"}
        notifications={notificationsHash["400"] ?? []}
      />
    </Grid>
  );
};

interface NotificationMapperProps {
  code: HashCode;
  notifications: Notification[];
}

const NotificationMapper: React.FunctionComponent<NotificationMapperProps> = ({
  code,
  notifications,
}) => {
  return (
    <Grid item xs={6} sm={3} display="flex" justifyContent="space-around">
      <Paper
        sx={{
          borderRadius: 10,
          width: "100%",
          maxWidth: 220,
          height: 150,
          padding: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
        elevation={5}
      >
        {/* <Typography>You have</Typography> */}
        <Typography variant="h2">{notifications?.length ?? 0}</Typography>
        <Typography noWrap variant="body2">
          {returnCategory(parseInt(code)).toUpperCase()}
        </Typography>
      </Paper>
    </Grid>
  );
};

const returnCategory = (code: number): string => {
  switch (code) {
    case 100:
      return "invitations";
    case 200 || 201:
      return "responses";
    case 300 || 301:
      return "gig updates";
    case 400:
      return "messages";
    default:
      return "";
  }
};

export default GigDashBoard;
