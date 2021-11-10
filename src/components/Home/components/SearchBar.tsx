import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  TextField,
  Autocomplete,
  Avatar,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import { Search } from "@mui/icons-material";
import { fetchHandler } from "../../_helpers/fetchHandler";
import API_URL from "../../_helpers/environment";
import { UserCtx } from "../../Context/MainContext";
import { AppState } from "../../../App";
import "../Home.css";
import { smallImage } from "../../_helpers/helpers";

interface SearchBarProps extends RouteComponentProps {
}

interface SearchBarState {
  searchResults: any[];
  query: string;
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  static contextType = UserCtx;

  constructor(props: SearchBarProps, context: AppState) {
    super(props, context);
    this.state = { searchResults: [], query: "" };
  }

  handleSearch = (url: string) => this.props.history.push(url);
  setQuery = (query: string): void => this.setState({ query });
  searchFetch = async (): Promise<boolean> => {
    // if (this.state.query.length < 3) return false;
    try {
      const { users, message, success } = await fetchHandler({
        url: `${API_URL}/user/search/${this.state.query}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      this.setState({ searchResults: [...new Set(users)] });
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  componentDidUpdate(prevProps: SearchBarProps, prevState: SearchBarState) {
    //fetch as user types
    prevState.query !== this.state.query &&
      !!this.state.query &&
      this.searchFetch();

      //clear the search suggestions when search empty
    prevState.query && !this.state.query && this.setState({searchResults: []})
  }

  render() {
    return (
      <Autocomplete
        freeSolo
        // clearOnBlur
        className="search-bar"
        id="search-bar"
        isOptionEqualToValue={() => true}
        sx={{ width: {xs: 200, sm: 300} }}
        noOptionsText="No results!"
        openOnFocus
        value={this.state.query}
        getOptionLabel={(o) => this.state.query}
        options={this.state.searchResults}
        //when option is selected
        onChange={(e: any, option: any) => {
          this.handleSearch(option?.url);
          this.setState({ searchResults: [] });
          this.setQuery("");
        }}
        //as user types
        onInputChange={(e: any, query: string) => {
          this.setQuery(query);
        }}
        //include entire array
        filterOptions={(x) => x}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id} sx={{}}>
              <Avatar src={smallImage(option.photo, 40)} alt="" />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Typography variant="subtitle1">{option.name}</Typography>{" "}
            <Typography variant="body1">{option.role}</Typography>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment
                  position="end"
                >
                  <Search 
                  className='mag-glass'
                  />
                </InputAdornment>
              ),
            }}
            
            label="Search"
          />
        )}
      />
    );
  }
}

export default withRouter(SearchBar);
