import { Grid, Paper, Typography, CardActionArea } from "@mui/material";
import { HashCode } from "../../Gig.types";
import { Notification } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";

interface BarMapperProps extends GigIndexState {
  code: HashCode;
  notifications: Notification[];
  color: string;
}

const BarMapper: React.FunctionComponent<BarMapperProps> = ({
  code,
  color,
  messageCode,
  setGigState,
}) => {
  const handleClick = () => setGigState("messageCode", parseInt(code));

  return (
    <>
      {/* <Grid item xs={12}> */}
        <CardActionArea onClick={handleClick}>
          <Paper
            sx={{
              borderRadius: 0,
              // width: "100%",
              height: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              background: color + "",
              color: parseInt(code) === messageCode ? "white" : "",
            }}
            elevation={5}
          >
            {/* <Typography>You have</Typography> */}
            {/* <Typography variant="body2" display='inline'>{notifications?.length ?? 0}</Typography> */}
            <Typography variant="caption" display="inline">
              {returnCategory(parseInt(code)).toUpperCase()}
            </Typography>
          </Paper>
          <div
            style={{
              height: 2,
              backgroundColor: parseInt(code) === messageCode ? "white" : "",
            }}
          />
        </CardActionArea>
      {/* </Grid> */}
    </>
  );
};

const returnCategory = (code: number): string => {
  switch (code) {
    case 100:
      return "invitations";
    case 200 || 201:
      return "responses";
    case 300 || 301:
      return "updates";
    case 400:
      return "messages";
    default:
      return "";
  }
};

export default BarMapper;
