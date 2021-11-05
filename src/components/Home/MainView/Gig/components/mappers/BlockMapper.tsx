import { Grid, Paper, Typography, CardActionArea, Button } from "@mui/material";
import { HashCode } from "../../Gig.types";
import { Notification } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";

interface BlockMapperProps extends GigIndexState {
  code: HashCode;
  notifications: Notification[];
  color: string;
  setGigState: (key: string, value: any) => void;
}

const BlockMapper: React.FunctionComponent<BlockMapperProps> = ({
  code,
  notifications,
  color,
  messageCode,
  setGigState,
}) => {
  const handleClick = () => setGigState("messageCode", parseInt(code));

  return (
    <Grid item xs={6} sm={3} display="flex" justifyContent="space-around">
      {/* <CardActionArea sx={{padding:1}} > */}
      <Button
        variant="text"
        onClick={handleClick}
        id={`${returnCategory(parseInt(code)).toUpperCase()}-route`}
        title={`${returnCategory(parseInt(code)).toUpperCase()}-route`}
        sx={{
          display: "flex",
          flexDirection: "column",
          // justifyContent: "space-around",
          color: "white",
          borderRadius: 10,
          width: "100%",
          maxWidth: 220,
          height: 80,
          // padding: 1,
        }}
      >
        <Paper
          sx={{
            borderRadius: 10,
            width: "100%",
            maxWidth: 220,
            height: 80,
            padding: 1,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-around",
            alignItems: "center",
            background:
              parseInt(code) === messageCode || !messageCode
                ? color + "85"
                : "",
            color: parseInt(code) === messageCode ? "white" : "",
            cursor: "pointer",
          }}
          elevation={5}
          onClick={handleClick}
        >
          {/* <Typography>You have</Typography> */}
          <Typography variant="h4">{notifications?.length ?? 0}</Typography>
          <Typography noWrap variant="body2">
            {returnCategory(parseInt(code)).toUpperCase()}
          </Typography>
        </Paper>
      </Button>
      {/* <div
            style={{
              height: 2,
              backgroundColor: ,
            }}
          /> */}
      {/* </CardActionArea> */}
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

export default BlockMapper;
