import { FunctionComponent } from "react";
import { Gig, User } from "../../../../../../../types/API.types";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { HashLink as Link } from "react-router-hash-link";
import { Grid } from "@mui/material";
import { returnTime } from "../../../../../../_helpers/helpers";
import { stringAvatar } from "../../../../Settings/Header";
import { DetailedGig } from "../../../Gig.types";
import { LocationOn, AttachMoney } from "@mui/icons-material";
import "../../../Gig.css";

interface GigProps extends Gig {
  detailsHash: { [key: string]: DetailedGig };
  userId: number | null;
  user: User;
}

const GigCard: FunctionComponent<GigProps> = ({
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
  const avatarSize: number = 50;

  const bandLeader = detailsHash[id]?.bandLeader ?? user;

  const defaultAvatarProps: any = {
    src: bandLeader?.photo,
    alt: bandLeader?.name,
    sx: { height: avatarSize, width: avatarSize },
  };

  const colors = ["secondary.light", "secondary.dark", "secondary.main"];
  return bandLeader ? (
    <Card elevation={5} sx={{ margin: 1, borderRadius: 3 }}>
      <Link smooth to={`/main/gig/${id}#gig-anchor`}>
        <CardActionArea>
          <CardHeader
            sx={{
              color: "white",
              backgroundColor: colors[Math.floor(Math.random() * 3)],
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
              <div className="justify">
                <Typography>{description}</Typography>
                <AttachMoney
                  fontSize="inherit"
                  sx={{ marginLeft: "auto", position: "relative", top: 3 }}
                />
                <Typography variant="caption" display="inline">
                  {payment}
                </Typography>
              </div>
            }
            subheader={
              <Typography>
                {gigDate.toLocaleDateString()} {returnTime(gigDate)}
              </Typography>
            }
          />
        </CardActionArea>
      </Link>
      {userId === bandLeader.id ? (
        <>
          <CardContent
            sx={{ display: "flex", justifyContent: "space-between" }}
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
            sx={{ display: "flex", justifyContent: "space-between" }}
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
      )}
    </Card>
  ) : null;
};

export default GigCard;
