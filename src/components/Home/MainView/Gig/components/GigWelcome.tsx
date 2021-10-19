import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Grid, Paper, Typography } from "@mui/material";
import { HashCode } from "../Gig.types";
import GigDashBoard from "./GigDashboard";

interface GigWelcomeProps extends GigIndexState {}

const GigWelcome: React.FunctionComponent<GigWelcomeProps> = (
  props: GigWelcomeProps
) => {
  const { user } = props;

  return (
    <>
      <Typography variant="h5" paddingBottom={3}>
        {`Welcome back, ${user.name.split(" ")[0]}!`}
      </Typography>
      <GigDashBoard {...props} />
      
    </>
  );
};

export default GigWelcome;
