import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import "./Home/Home.css";
import { Grid, Paper } from "@mui/material";

export function BoardSkeleton() {
  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Skeleton variant="rectangular" width={"100%"} height={118} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </Stack>
  );
}

export function GigSkeleton() {
  return (
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Skeleton variant="circular" width={40} height={40} />
      <Skeleton variant="text" />
    </Stack>
  );
}

export function Loading() {
  return (
    <Grid
      container
      item
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: 360,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </Grid>
      </Paper>
    </Grid>
  );
}

export function LoadingFeed() {
  return (
    <Grid
      container
      item
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Grid>
    </Grid>
  );
}
