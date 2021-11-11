import React from "react";
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

interface SearchBarProps extends RouteComponentProps {}

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

  onChange = (e: any, option: any) => {
    this.handleSearch(option?.url);
    this.setState({ searchResults: [] });
    this.setQuery("");
  };

  inputChange = (e: any, query: string) => {
    this.setQuery(query);
  };

  renderOption = (props: any, option: any) => (
    <Box
      {...props}
      component="li"
      key={option.id}
      display="flex"
      pl={2}
      justifyContent="space-between"
    >
      <Box
        component="div"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Avatar
          src={smallImage(option.photo ?? "", 20)}
          variant="square"
          alt=""
          sx={{ height: 20, width: 20 }}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Typography variant="subtitle1">{option.name}</Typography>{" "}
      </Box>
      <Typography ml={"auto"} variant="body2" fontWeight={300}>
        {option.role}
      </Typography>
    </Box>
  );

  componentDidUpdate(prevProps: SearchBarProps, prevState: SearchBarState) {
    prevState.query !== this.state.query &&
      !!this.state.query &&
      this.searchFetch();

    prevState.query &&
      !this.state.query &&
      this.setState({ searchResults: [] });
  }

  render() {
    return (
      <Autocomplete
        freeSolo
        clearOnBlur
        className="search-bar"
        id="search-bar"
        isOptionEqualToValue={() => true}
        fullWidth
        noOptionsText="No results!"
        openOnFocus
        value={this.state.query}
        getOptionLabel={() => this.state.query}
        options={this.state.searchResults}
        onChange={this.onChange}
        onInputChange={this.inputChange}
        filterOptions={(x) => x}
        renderOption={this.renderOption}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            onBlur={() => this.setState({ query: "" })}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <Search className="mag-glass" />
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
