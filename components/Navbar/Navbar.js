import Link from "../Link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { makeStyles, useTheme } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Container,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  IconButton,
  Box
} from "@mui/material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

import MenuIcon from "@mui/icons-material/Menu";

import { routes } from "data/routes";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function ElevationScroll(props) {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    marginBottom: `5em`,
    [theme.breakpoints.down("md")]: {
      marginBottom: "4em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "2em",
    },
  },
  logo: {
    color: theme.palette.secondary.main,
    width: "max-content",
    fontSize: "26px !important",
    marginLeft: "20px !important",
    '@media (max-width:960px)': {
      display: "none"
    }
  },
  drawerIconContainer: {
    marginLeft: "auto",
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerIcon: {
    height: `50px`,
    width: `50px`,
    color: `#fff`,
    [theme.breakpoints.down("xs")]: {
      height: `40px`,
      width: `40px`,
    },
  },
  drawer: {
    backgroundColor: theme.palette.secondary.main,
    padding: "0 6em",
  },
  link: {
    fontSize: "24px !important",
    color: theme.palette.secondary.main,
    textDecoration: "none",
    "&:hover": {
      color: "black",
    },
  },
  appBar: {
    backgroundColor: "#181818"
  },
  date: {
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '14px',
    color: '#939393',
    marginLeft: '12px'
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const [openDrawer, setOpenDrawer] = useState(false);

  const router = useRouter();

  const path = routes;

  const tabs = (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Box display='flex'>
          <Box display='flex' alignItems='center'>
            <img src='calendar.svg' />
            <Typography className={classes.date}>1 august 2022</Typography>
          </Box>
          <Box display='flex' alignItems='center' ml={4}>
            <img src='timer.svg' />
            <Typography className={classes.date}>00:00</Typography>
          </Box>
        </Box>
        <Box display='flex'>
          <Box display='flex' alignItems='center' mr={4}>
            <img src='sticky.svg' />
            <Typography className={classes.date} style={{ color: '#26891E' }}>Old slips</Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <img src='pin.svg' />
            <WalletMultiButton />
          </Box>
        </Box>
      </Grid>
    </>
  );
  const drawer = (
    <>
      <Grid container>
        <Grid item lg={4} xs={6}>
          <WalletMultiButton />
        </Grid>
      </Grid>
    </>
  );
  return (
    <>
      <ElevationScroll>
        <AppBar className={classes.appBar} position="static">
          <Container>
            <Toolbar
              disableGutters
              style={{
                margin: "0 auto",
                width: "100%"
              }}
            >
              {matches ? drawer : tabs}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>

      {/* <div className={classes.toolbarMargin} /> */}
    </>
  );
};
export default Navbar;
