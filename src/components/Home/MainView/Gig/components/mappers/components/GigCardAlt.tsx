import { FunctionComponent } from "react";
import { Gig, User } from "../../../../../../../types/API.types";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { HashLink as Link } from "react-router-hash-link";
import { ListItem } from "@mui/material";
import { returnTime } from "../../../../../../_helpers/helpers";
import { stringAvatar } from "../../../../Settings/Header";
import { DetailedGig } from "../../../Gig.types";
import { AttachMoney } from "@mui/icons-material";
import "../../../Gig.css";
import { Box } from "@mui/system";

interface GigProps extends Gig {
  detailsHash: { [key: string]: DetailedGig };
  userId: number | null;
  user: User;
}

const GigCardAlt: FunctionComponent<GigProps> = ({
  userId,
  date,
  description,
  id,
  payment,
  gigLocation,
  detailsHash,
  user,
}) => {
  const gigDate: Date = new Date(date);
  const avatarSize: number = 25;

  const bandLeader = detailsHash[id]?.bandLeader ?? user;

  const defaultAvatarProps: any = {
    src: bandLeader?.photo,
    alt: bandLeader?.name,
    sx: { height: avatarSize, width: avatarSize },
  };

  return bandLeader ? (
    <Link smooth to={`/main/gig/${id}#gig-anchor`}>
      <ListItem
        disablePadding
        sx={{ border: "solid 1px rgba(255, 255, 255, 0.06)" }}
        className='list-link'
      >
        <CardHeader
          sx={{
            color: "white",
            width: "100%",
          }}
          avatar={
            bandLeader?.photo ? (
              <Avatar
                {...defaultAvatarProps}
                src={bandLeader.photo}
                alt={bandLeader.name}
              />
            ) : (
              <>
                <Avatar
                  {...stringAvatar(bandLeader.name, avatarSize)}
                  alt={bandLeader.name}
                />
              </>
            )
          }
          title={
            <Box
              component="div"
              display="flex"
              width={"100%"}
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">{description}</Typography>
              <div className="justify">
                <AttachMoney
                  fontSize="inherit"
                  color="success"
                  sx={{ marginLeft: "auto", position: "relative", top: 3 }}
                />
                <Typography variant="caption" display="inline">
                  {payment}
                </Typography>
              </div>
            </Box>
          }
          subheader={
            <Typography variant="caption" fontWeight={300}>
              {gigDate.toLocaleDateString()} {returnTime(gigDate)}
            </Typography>
          }
        />

        {/* AUTHORIZE GIG OWNER */}
        {/* {userId === bandLeader.id ? (
        <>
          <CardContent
            // sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={7}>
              <Typography variant="caption">
                <strong>You</strong> are the bandleader.
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <div className="justify">
                <LocationOn fontSize="small" color="error" />
                <Typography variant="caption" display="inline">
                  {gigLocation}
                </Typography>
              </div>
            </Grid>
          </CardContent>
        </>
      ) : (
        <>
          <CardContent
            // sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={6}>
              <Typography variant="caption">
                <strong>{bandLeader.name}</strong> invited you.
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" flexDirection="column">
              <div className="justify">
                <LocationOn fontSize="small" color="error" />
                <Typography variant="caption" display="inline">
                  {gigLocation}
                </Typography>
              </div>
            </Grid>
          </CardContent>
        </>
      )} */}
      </ListItem>
    </Link>
  ) : null;
};

export default GigCardAlt;
