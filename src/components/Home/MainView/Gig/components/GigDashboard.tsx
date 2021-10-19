import React from 'react'

import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Grid, Paper, Typography, CardActionArea } from "@mui/material";
import { HashCode } from "../Gig.types";

interface GigDashBoardProps extends GigIndexState {}
interface GigDashBoardState{
}
class GigDashBoard extends React.Component<GigDashBoardProps, GigDashBoardState> {
  constructor(props: GigDashBoardProps){
    super(props)
  }
  
  
  render(){
    const { notificationsHash, setGigState } = this.props;
  return (
    <>
      <Grid
        container
        spacing={2}
        padding={1}
        display="flex"
        justifyContent="space-around"
      >
        <NotificationMapper
          setGigState={setGigState}
          code={"100"}
          color='#2374D2'
          notifications={notificationsHash["100"] ?? []}
        />
        <NotificationMapper
          setGigState={setGigState}
          code={"200"}
          color='#777755'
          notifications={[
            ...(notificationsHash["200"] ?? []),
            ...(notificationsHash["201"] ?? []),
          ]}
        />
        <NotificationMapper
          setGigState={setGigState}
          code={"300"}
          color='#4caf50'
          notifications={[
            ...(notificationsHash["300"] ?? []),
            ...(notificationsHash["301"] ?? []),
          ]}
        />
        <NotificationMapper
          setGigState={setGigState}
          code={"400"}
          color='#ba68c8'
          notifications={notificationsHash["400"] ?? []}
        />
      
      </Grid>
    </>
  )};
};

interface NotificationMapperProps {
  code: HashCode;
  notifications: Notification[];
  color: string;
  setGigState: (key: string, value: any) => void
}

const NotificationMapper: React.FunctionComponent<NotificationMapperProps> = ({
  code,
  notifications,
  color,
  setGigState,
}) => {
  const handleClick = () => setGigState('messageCode', parseInt(code))

  return (
    <Grid item xs={6} sm={3} display="flex" justifyContent="space-around">
      <CardActionArea sx={{padding:1}} onClick={handleClick}>
        
          <Paper
            sx={{
              borderRadius: 10,
              width: "100%",
              maxWidth: 220,
              height: 80,
              padding: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              background: color
            }}
            elevation={5}
          >
            {/* <Typography>You have</Typography> */}
            <Typography variant="h4">{notifications?.length ?? 0}</Typography>
            <Typography noWrap variant="body2" >
              {returnCategory(parseInt(code)).toUpperCase()}
            </Typography>
          </Paper>
        
      </CardActionArea>
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
