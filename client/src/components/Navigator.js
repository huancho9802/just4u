import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import BriefcaseIcon from "@material-ui/icons/BusinessCenter";
import EventIcon from "@material-ui/icons/EventNote";
import TaskIcon from "@material-ui/icons/FormatListBulleted";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import ContactsIcon from "@material-ui/icons/Contacts";
import SignoutIcon from "@material-ui/icons/ExitToApp";

// import api
import api from "../api/api.js";

const categories = [
  {
    id: "Your Stuff",
    children: [
      { id: "User Profile", icon: <PersonIcon />, to: "user" },
      { id: "Cases", icon: <BriefcaseIcon />, to: "cases" },
      { id: "Events", icon: <EventIcon />, to: "events" },
      { id: "Tasks", icon: <TaskIcon />, to: "tasks" },
      { id: "Calendar", icon: <CalendarIcon />, to: "calendar" },
      { id: "Contacts", icon: <ContactsIcon />, to: "contacts" },
    ],
  },
];

const styles = (theme) => ({
  categoryHeader: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  item: {
    paddingTop: 1,
    paddingBottom: 1,
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
  },
  itemCategory: {
    backgroundColor: "#232f3e",
    boxShadow: "0 -1px 0 #404854 inset",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  firebase: {
    fontSize: 24,
    color: theme.palette.common.white,
  },
  itemActiveItem: {
    color: "#4fc3f7",
  },
  itemPrimary: {
    fontSize: "inherit",
  },
  itemIcon: {
    minWidth: "auto",
    marginRight: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: ""
    };
  }

  signOut() {
    api
      .get("/auth/signout")
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  changeActive(value) {
    this.setState({ active: value });
  }

  render() {
    const { classes, ...other } = this.props;
    const { active } = this.state;
    return (
      <Drawer variant="permanent" {...other}>
        <List disablePadding>
          <ListItem
            className={clsx(
              classes.firebase,
              classes.item,
              classes.itemCategory
            )}
          >
            Navigation
          </ListItem>
          <Link to={`/home`} style={{ textDecoration: "none" }}>
            <ListItem
              className={clsx(classes.item, classes.itemCategory, active === "" && classes.itemActiveItem)}
              button
              onClick={() => this.changeActive("")}
            >
              <ListItemIcon className={classes.itemIcon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                classes={{
                  primary: classes.itemPrimary,
                }}
              >
                Dashboard
              </ListItemText>
            </ListItem>
          </Link>
          <ListItem className={clsx(classes.item, classes.itemCategory)} button onClick={() => this.signOut()}>
            <ListItemIcon className={classes.itemIcon}>
              <SignoutIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Sign Out
            </ListItemText>
          </ListItem>
          {categories.map(({ id, children }) => (
            <React.Fragment key={id}>
              <ListItem className={classes.categoryHeader}>
                <ListItemText
                  classes={{
                    primary: classes.categoryHeaderPrimary,
                  }}
                >
                  {id}
                </ListItemText>
              </ListItem>
              {children.map(({ id: childId, icon, to }) => (
                <Link to={`/home/${to}`} style={{ textDecoration: "none" }}>
                  <ListItem
                    key={childId}
                    button
                    onClick={() => this.changeActive(to)}
                    className={clsx(
                      classes.item,
                      active === to && classes.itemActiveItem
                    )}
                  >
                    <ListItemIcon className={classes.itemIcon}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: classes.itemPrimary,
                      }}
                    >
                      {childId}
                    </ListItemText>
                  </ListItem>
                </Link>
              ))}

              <Divider className={classes.divider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    );
  }
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
