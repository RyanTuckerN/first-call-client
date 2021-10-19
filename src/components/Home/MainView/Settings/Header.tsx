import * as React from "react";
import { User } from "../../../../types/API.types";
import {
  Avatar,
  Divider,
  Box,
  Typography,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import { AddAPhoto, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Settings.css";
import { StringSetter } from "../../../../App.types";
import { height } from "@mui/system";
const avatarSize: number = 120;

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

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      height: avatarSize,
      width: avatarSize,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}
const Header: React.FunctionComponent<HeaderProps> = ({
  user,
  handlePhoto,
}) => {
  // const addOrEditProps: any = {
  //   style: {
  //     position: "relative",
  //     top: 80,
  //     right: 31,
  //     backgroundColor: "#51abcb",
  //     borderRadius: '50%',
  //     height: 30,
  //     width: 30,
  //     display: 'flex',
  //     justifyContent: 'center',
  //     alignItems: 'center'
  //   },
  // };
  const defaultAvatarProps: any = {
    src: user.photo,
    alt: user.name,
    sx: { height: avatarSize, width: avatarSize },
  };
  return (
    <Box sx={{ padding: 2 }}>
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
              {/* <IconButton {...addOrEditProps}> */}
              <label htmlFor="raised-button-file" id="image-edit-button">
                <AddAPhoto style={{color: 'white'}} />
              </label>
              {/* </IconButton> */}
            </>
          ) : (
            <>
              <Avatar {...stringAvatar(user.name)} alt={user.name} />
              <input
                accept="image/*"
                onChange={handlePhoto}
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
              />
              <label htmlFor="raised-button-file" id="image-edit-button">
                <AddAPhoto  style={{color: 'white'}} />
              </label>
            </>
          )}
          <div className="header-text">
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2">Your account</Typography>
          </div>
        </div>
        <div className="right">
          <Link to="/main/profile">
            <Button>Go to your profile</Button>
          </Link>
        </div>
      </div>
    </Box>
  );
};

export default Header;
