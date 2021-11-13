import { FunctionComponent, useContext } from "react";
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
import { UserCtx } from "../../../../../../Context/MainContext";

interface GigProps extends Gig {
  detailsHash: { [key: string]: DetailedGig };
  userId: number | null;
  user: User;
}

const GigCardAlt: FunctionComponent<GigProps> = ({
  date,
  description,
  id,
  payment,
  detailsHash,
  user,
}) => {
  const context = useContext(UserCtx);
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
        className="list-link"
        sx={{
          border: "solid 1px",
          borderColor: {
            xs:
              context?.darkModeOn! === "true"
                ? "rgba(255, 255, 255, 0.06)"
                : "rgba(0,0,0,.12)",
            md: "rgba(255, 255, 255, 0.06)",
          },
        }}
      >
        <CardHeader
          sx={{
            color: {
              xs: context?.darkModeOn! === "true" ? "white" : "black",
              md: "white",
            },
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
      </ListItem>
    </Link>
  ) : null;
};

export default GigCardAlt;
