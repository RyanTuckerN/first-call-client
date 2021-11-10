import * as React from "react";
import { User } from "../../../../types/API.types";
import {
  Avatar,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { AddAPhoto } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { StringSetter } from "../../../../App.types";
import "./Settings.css";

const avatarSize: number = 100;

interface HeaderProps {
  user: User;
  handlePhoto: StringSetter;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name: string, size: number) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      height: size,
      width: size,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const Header: React.FunctionComponent<HeaderProps> = ({
  user,
  handlePhoto,
}) => {
  const defaultAvatarProps: any = {
    src: user.photo,
    alt: user.name,
    sx: { height: avatarSize, width: avatarSize },
  };
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5">{user.name}</Typography>
      <Typography variant="body2">Your account</Typography>
      <div className="flexbox">
        <div className="user-container left">
          {user.photo ? (
            <>
              <Avatar {...defaultAvatarProps} alt={user.name} />
              <input
                accept="image/*"
                onChange={handlePhoto}
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
              />
              <label htmlFor="raised-button-file" id="image-edit-button">
                <AddAPhoto style={{ color: "white" }} />
              </label>
            </>
          ) : (
            <>
              <Avatar
                {...stringAvatar(user.name, avatarSize)}
                alt={user.name}
              />
              <input
                accept="image/*"
                onChange={handlePhoto}
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
              />
              <label htmlFor="raised-button-file" id="image-edit-button">
                <AddAPhoto style={{ color: "white" }} />
              </label>
            </>
          )}
          <div className="header-text"></div>
        </div>
          <Link to={`/main/profile/${user.id}`}>
            <Button sx={{marginLeft: -2}}>Go to your profile</Button>
          </Link>
      </div>
    </Box>
  );
};

export default Header;
