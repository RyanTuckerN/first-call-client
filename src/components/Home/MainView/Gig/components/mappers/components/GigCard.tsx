import { FunctionComponent } from "react";
import { Gig, User } from "../../../../../../../types/API.types";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {Link} from 'react-router-dom'
import { red } from "@mui/material/colors";
import { Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { returnTime } from "../../../../../../_helpers/helpers";
import zIndex from "@mui/material/styles/zIndex";
import { stringAvatar } from "../../../../Settings/Header";
import { DetailedGig } from "../../../Gig.types";
import { LocationOn, AttachMoney, Event } from "@mui/icons-material";
import "../../../Gig.css";

interface GigProps extends Gig {
  detailsHash: { [key: string]: DetailedGig }  ;
  userId: number | null;
  user: User
}

const GigCard: FunctionComponent<GigProps> = ({
  callStack,
  photo,
  userId,
  date,
  description,
  id,
  payment,
  location,
  detailsHash,
  user
}) => {
  const gigDate: Date = new Date(date);
  const avatarSize: number = 50;

  const bandLeader = detailsHash[id]?.bandLeader ?? user;

  const defaultAvatarProps: any = {
    src: bandLeader?.photo,
    alt: bandLeader?.name,
    sx: { height: avatarSize, width: avatarSize },
  };

  const getRandomColor = (): string => {
    const letters = "0123456789ABCDEF".split("");
    let color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return bandLeader ? (
    <Card elevation={5} sx={{ margin: 1, borderRadius: 4 }}>
        
        <Link to={`/main/gig/${id}`}>
          <CardActionArea>
            <CardHeader
              sx={{
                // maxHeight: 75,
                // backgroundImage: photo ?? "url(https://source.unsplash.com/random)",
                background: '#fe3964' + "40",
              }}
              avatar={
                bandLeader?.photo ? (
                  <Avatar
                    {...defaultAvatarProps}
                    src={bandLeader.photo}
                    alt={bandLeader.name}
                  />
                ) : (
                  // ** *** TERNARY *** ** //
                  // ** *** TERNARY *** ** //
                  <>
                    <Avatar
                      // sx={{height: 50}}
                      {...stringAvatar(bandLeader.name, avatarSize)}
                      alt={bandLeader.name}
                    />
                  </>
                )
              }
          
              title={
                <div className="justify">
                  <Typography>{description}</Typography>
                  <AttachMoney fontSize="inherit" color="success" sx={{marginLeft: 'auto', position: 'relative', top: 3}} />
                  <Typography variant="caption" display="inline">
                    {payment}
                  </Typography>
                </div>
          
              }
              subheader={`${gigDate.toLocaleDateString()}, ${returnTime(gigDate)}`}
            />
          </CardActionArea>
        </Link>
        {/* AUTHORIZE GIG OWNER */}
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
                    {location}
                  </Typography>
                </div>
              </Grid>
            </CardContent>
            <Grid container>
              <Grid item xs={5} display="flex" justifyContent="space-around">
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    // expand={expanded}
                    // onClick={handleExpandClick}
                    // aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </>
        ) : (
          // ** *** TERNARY *** ** //
          // ** *** TERNARY *** ** //
          <>
            <CardContent
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              {/* <div className='justify'>
            <AttachMoney fontSize='small' color='success' /><Typography variant='caption' display='inline'>{payment}</Typography>
          </div>
          <div className='justify'>
            <LocationOn fontSize='small' color='error' /><Typography variant='caption' display='inline'>{location}</Typography>
          </div> */}
              <Grid item xs={6}>
                <Typography variant="caption">
                  <strong>{bandLeader.name}</strong> invited you.
                </Typography>
              </Grid>
              <Grid item xs={6} display="flex" flexDirection="column">
                <div className="justify">
                  <LocationOn fontSize="small" color="error" />
                  <Typography variant="caption" display="inline">
                    {location}
                  </Typography>
                </div>
              </Grid>
            </CardContent>
            <Grid container>
              <Grid item xs={5} display="flex" justifyContent="space-around">
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    // expand={expanded}
                    // onClick={handleExpandClick}
                    // aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </>
        )}
      </Card>
  ) : null;
};

export default GigCard;

// const offer = {
//   "3": {
//     gigInfo: {
//       gig: {
//         description: "Remarkable concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 425,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 1,
//         email: "user1@email.com",
//         name: "Nikola Falkenberg",
//         photo: "https://randomuser.me/api/portraits/med/women/90.jpg",
//       },
//       bandMembers: [
//         {
//           id: 4,
//           email: "user4@email.com",
//           name: "Bilge Bles",
//           role: "saxophone",
//         },
//         {
//           id: 5,
//           email: "user5@email.com",
//           name: "Bonnie Carr",
//           role: "accordian",
//         },
//       ],
//     },
//     message: "success",
//   },
// };
// const json = {
//   "1": {
//     gigInfo: {
//       gig: {
//         description: "Marvelous concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 325,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 1,
//         email: "user1@email.com",
//         name: "Nikola Falkenberg",
//         photo: "https://randomuser.me/api/portraits/med/women/90.jpg",
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "saxophone",
//         },
//         { id: 4, email: "user4@email.com", name: "Bilge Bles", role: "drums" },
//       ],
//     },
//     message: "success",
//   },
//   "4": {
//     gigInfo: {
//       gig: {
//         description: "Oceanic concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 375,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 1,
//         email: "user1@email.com",
//         name: "Nikola Falkenberg",
//         photo: "https://randomuser.me/api/portraits/med/women/90.jpg",
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "saxophone",
//         },
//         { id: 4, email: "user4@email.com", name: "Bilge Bles", role: "drums" },
//       ],
//     },
//     message: "success",
//   },
//   "8": {
//     gigInfo: {
//       gig: {
//         description: "Defective concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 150,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 2,
//         email: "user2@email.com",
//         name: "Elia Nguyen",
//         photo: "https://randomuser.me/api/portraits/med/women/86.jpg",
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "accordian",
//         },
//         {
//           id: 5,
//           email: "user5@email.com",
//           name: "Bonnie Carr",
//           role: "saxophone",
//         },
//       ],
//     },
//     message: "success",
//   },
//   "9": {
//     gigInfo: {
//       gig: {
//         description: "Defective concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 150,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         callStack: {
//           gigId: 9,
//           stackTable: {
//             drums: {
//               calls: ["user5@email.com"],
//               filled: true,
//               onCall: null,
//               confirmed: "user4@email.com",
//             },
//             accordian: {
//               calls: ["user5@email.com"],
//               filled: false,
//               onCall: "user1@email.com",
//             },
//             saxophone: { calls: [], filled: false, onCall: "user4@email.com" },
//           },
//           filled: false,
//           createdAt: "2021-10-20T00:55:06.425Z",
//           updatedAt: "2021-10-20T00:55:19.366Z",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 3,
//         email: "user3@email.com",
//         name: "Florisbela Silva",
//         photo: "https://randomuser.me/api/portraits/med/women/17.jpg",
//       },
//       bandMembers: [
//         { id: 4, email: "user4@email.com", name: "Bilge Bles", role: "drums" },
//       ],
//     },
//     message: "success",
//   },
//   "10": {
//     gigInfo: {
//       gig: {
//         description: "Flowery concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 200,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         callStack: {
//           gigId: 10,
//           stackTable: {
//             drums: {
//               calls: ["user5@email.com"],
//               filled: false,
//               onCall: "user1@email.com",
//             },
//             accordian: {
//               calls: [],
//               filled: false,
//               onCall: null,
//               emptyStack: true,
//             },
//             saxophone: {
//               calls: ["user3@email.com"],
//               filled: false,
//               onCall: "user6@email.com",
//             },
//           },
//           filled: false,
//           createdAt: "2021-10-20T00:55:06.614Z",
//           updatedAt: "2021-10-20T00:55:14.055Z",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 3,
//         email: "user3@email.com",
//         name: "Florisbela Silva",
//         photo: "https://randomuser.me/api/portraits/med/women/17.jpg",
//       },
//       bandMembers: [],
//     },
//     message: "success",
//   },
//   "11": {
//     gigInfo: {
//       gig: {
//         description: "Scientific concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 450,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         callStack: {
//           gigId: 11,
//           stackTable: {
//             drums: { calls: [], filled: false, onCall: "user1@email.com" },
//             accordian: {
//               calls: [],
//               filled: true,
//               onCall: null,
//               confirmed: "user5@email.com",
//             },
//             saxophone: {
//               calls: ["user2@email.com"],
//               filled: false,
//               onCall: "user0@email.com",
//             },
//           },
//           filled: false,
//           createdAt: "2021-10-20T00:55:06.726Z",
//           updatedAt: "2021-10-20T00:55:18.834Z",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 3,
//         email: "user3@email.com",
//         name: "Florisbela Silva",
//         photo: "https://randomuser.me/api/portraits/med/women/17.jpg",
//       },
//       bandMembers: [
//         {
//           id: 5,
//           email: "user5@email.com",
//           name: "Bonnie Carr",
//           role: "accordian",
//         },
//       ],
//     },
//     message: "success",
//   },
//   "12": {
//     gigInfo: {
//       gig: {
//         description: "Fast concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 200,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         callStack: {
//           gigId: 12,
//           stackTable: {
//             drums: {
//               calls: ["user1@email.com"],
//               filled: false,
//               onCall: "user0@email.com",
//             },
//             accordian: {
//               calls: ["user4@email.com"],
//               filled: false,
//               onCall: "user6@email.com",
//             },
//             saxophone: {
//               calls: ["user5@email.com"],
//               filled: false,
//               onCall: "user1@email.com",
//             },
//           },
//           filled: false,
//           createdAt: "2021-10-20T00:55:06.835Z",
//           updatedAt: "2021-10-20T00:55:06.835Z",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 3,
//         email: "user3@email.com",
//         name: "Florisbela Silva",
//         photo: "https://randomuser.me/api/portraits/med/women/17.jpg",
//       },
//       bandMembers: [],
//     },
//     message: "success",
//   },
//   "14": {
//     gigInfo: {
//       gig: {
//         description: "Panoramic concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 375,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 4,
//         email: "user4@email.com",
//         name: "Bilge Bles",
//         photo: "https://randomuser.me/api/portraits/med/women/58.jpg",
//       },
//       bandMembers: [
//         {
//           id: 2,
//           email: "user2@email.com",
//           name: "Elia Nguyen",
//           role: "accordian",
//         },
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "drums",
//         },
//         { email: "user4@email.com", role: "saxophone" },
//       ],
//     },
//     message: "success",
//   },
//   "17": {
//     gigInfo: {
//       gig: {
//         description: "Afraid concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 50,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 5,
//         email: "user5@email.com",
//         name: "Bonnie Carr",
//         photo: "https://randomuser.me/api/portraits/med/women/27.jpg",
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "accordian",
//         },
//       ],
//     },
//     message: "success",
//   },
//   "18": {
//     gigInfo: {
//       gig: {
//         description: "Overwrought concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 375,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 5,
//         email: "user5@email.com",
//         name: "Bonnie Carr",
//         photo: "https://randomuser.me/api/portraits/med/women/27.jpg",
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "saxophone",
//         },
//         {
//           id: 4,
//           email: "user4@email.com",
//           name: "Bilge Bles",
//           role: "accordian",
//         },
//       ],
//     },
//     message: "success",
//   },
//   "21": {
//     gigInfo: {
//       gig: {
//         description: "Recital",
//         date: "2022-03-22T22:30:00.543Z",
//         payment: 400,
//         optionalInfo: {
//           meal: "Surf and turf",
//           attire: "Formal",
//           rehearsal: "day-of",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 6,
//         email: "leader1@gmail.com",
//         name: "Nick Tucker",
//         photo: null,
//       },
//       bandMembers: [
//         {
//           id: 3,
//           email: "user3@email.com",
//           name: "Florisbela Silva",
//           role: "saxophone",
//         },
//         { id: 2, email: "user2@email.com", name: "Elia Nguyen", role: "drums" },
//         { email: "yourOwnAccordian@email.me", role: "accordian" },
//         { email: "kipp0@boob.gov", role: "harmonica" },
//       ],
//     },
//     message: "success",
//   },
// };
