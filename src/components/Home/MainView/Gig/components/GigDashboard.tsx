import React from "react";

import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Grid, Paper, Typography, CardActionArea, Divider } from "@mui/material";
import { HashCode } from "../Gig.types";
import BlockMapper from "./mappers/BlockMapper";
import BarMapper from "./mappers/BarMapper";

interface GigDashBoardProps extends GigIndexState {
  width: number
}
interface GigDashBoardState {
}
class GigDashBoard extends React.Component<
  GigDashBoardProps,
  GigDashBoardState
> {
  constructor(props: GigDashBoardProps) {
    super(props);

  }



  render() {
    const { notificationsHash, notifications } = this.props;
    const { width } = this.props;
    return width >= 900 && notifications.length? (
      <>
        <Grid
          container
          spacing={2}
          padding={1}
          display="flex"
          justifyContent="space-around"
          
        >
          <BlockMapper
            {...this.props}
            code={"100"}
            color="#2374D2"
            notifications={notificationsHash["100"] ?? []}

          />
          <BlockMapper
            {...this.props}
            code={"200"}
            color="#777755"
            notifications={[
              ...(notificationsHash["200"] ?? []),
              ...(notificationsHash["201"] ?? []),
            ]}
          />
          <BlockMapper
            {...this.props}
            code={"300"}
            color="#4caf50"
            notifications={[
              ...(notificationsHash["300"] ?? []),
              ...(notificationsHash["301"] ?? []),
            ]}
          />
          {/* <BlockMapper
            {...this.props}
            code={"400"}
            color="#ba68c8"
            notifications={notificationsHash["400"] ?? []}
          /> */}
        </Grid>
      </>
    ) : (
      <>
        <Grid
          // container
          item
          xs={12}
          width={'100%'}
          // spacing={0}
          padding={0}
          display="flex"
          justifyContent="space-around"
          height={'26px'}
          // marginBottom={1}
        >
          <BarMapper
            {...this.props}
            code={"100"}
            color="#000000"
            notifications={notificationsHash["100"] ?? []}
          />
          <Divider orientation='vertical' />
          <BarMapper
            {...this.props}
            code={"200"}
            color="#000000"
            notifications={[
              ...(notificationsHash["200"] ?? []),
              ...(notificationsHash["201"] ?? []),
            ]}
          />
          <Divider orientation='vertical' />
          <BarMapper
            {...this.props}
            code={"300"}
            color="#000000"
            notifications={[
              ...(notificationsHash["300"] ?? []),
              ...(notificationsHash["301"] ?? []),
            ]}
          />
          {/* <BarMapper
            {...this.props}
            code={"400"}
            color="#ba68c8"
            notifications={notificationsHash["400"] ?? []}
          /> */}
        </Grid>
      </>
    );
  }
}

export default GigDashBoard;
