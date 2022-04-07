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
    backgroundColor: "#2E203D"
  }
}));

const Header = () => {
  const classes = useStyles();
  const theme = useTheme();
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const [openDrawer, setOpenDrawer] = useState(false);

  const router = useRouter();

  const path = routes;

  const tabs = (
    <>
      <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
        {/* <Grid item>
          <Link href="/">
            <Typography
              className={classes.link}
            >
              Staking
            </Typography>
          </Link>
        </Grid> */}
        {/* <Grid item>
          <Link href="/">
            <Typography
              className={classes.link}
            >
              Roadmap
            </Typography>
          </Link>
        </Grid> */}
        {/* <Grid item>
          <Link href="/">
            <Typography
              className={classes.link}
            >
              Rarity
            </Typography>
          </Link>
        </Grid> */}
        <Grid item>
          <Link href="/">
            <img src="logo.png" />
          </Link>
        </Grid>
        {/* <Grid item>
          <Link href="/">
            <Typography
              className={classes.link}
            >
              Manga
            </Typography>
          </Link>
        </Grid> */}
        {/* <Grid item>
          <Link href="/">
            <Typography
              className={classes.link}
            >
              Airdrop
            </Typography>
          </Link>
        </Grid> */}
        <Grid item>
          <WalletMultiButton />
        </Grid>
      </Grid>
    </>
  );
  const drawer = (
    <>
      <Grid container>
        <Grid item lg={4} xs={6}>
          <WalletMultiButton />
        </Grid>
        <Grid container item xs={6} justifyContent="end">
          <SwipeableDrawer
            disableBackdropTransition={!iOS}
            disableDiscovery={iOS}
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onOpen={() => setOpenDrawer(true)}
            classes={{ paper: classes.drawer }}
            anchor="right"
          >
            {/* <div className={classes.toolbarMargin} /> */}
            <List disablePadding>
              {path.map(({ name, link }) => (
                <ListItem
                  key={name}
                  divider
                  button
                  onClick={() => {
                    setOpenDrawer(false);
                  }}
                >
                  <ListItemText disableTypography>
                    <Link href={link}>
                      <Typography
                        style={{
                          color:
                            router.pathname === link
                              ? "primary"
                              : "rgb(107 107 107)",
                          fontWeight: router.pathname === link && "bold",
                        }}
                      >
                        {name}
                      </Typography>
                    </Link>
                  </ListItemText>
                </ListItem>
              ))}
            </List>
          </SwipeableDrawer>
          <IconButton
            onClick={() => setOpenDrawer(!openDrawer)}
            disableRipple
            className={classes.drawerIconContainer}
          >
            <MenuIcon className={classes.drawerIcon} />
          </IconButton>
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
                width: "100%",
                padding: matches ? "10px" : "10px",
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
export default Header;
