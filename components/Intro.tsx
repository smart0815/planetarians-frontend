import React, { FC, useState, useEffect } from 'react'
import { makeStyles, useTheme } from "@mui/styles"
import axios from 'axios'

import {
  Container,
  Typography,
  Grid
} from '@mui/material'

interface Props {
  stakedInfo: any
}

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: 80,
    paddingBottom: 15,
    background: "linear-gradient(0deg, #3f4a65 0%, rgba(40, 9, 3, 0) 100%)",
    '@media (max-width:960px)': {
      paddingTop: 50
    }
  },
  leftSection: {
    background: "#2E203D",
    borderRadius: 12,
    padding: "35px 30px",
    '@media (max-width:960px)': {
      padding: "20px"
    }
  },
  rightSection: {
    borderRadius: 12,
    overflow: "hidden",
    height: "100%"
  },
  smallBox: {
    background: "#2e203D",
    border: "1px solid white",
    borderRadius: 11,
    padding: "10px 20px",
    width: "100%",
    height: "100%"
  },
  inputContainer: {
    background: "#3C0E07",
    padding: "35px 30px",
    height: "100%",
    position: "relative",
    "&::after": {
      content: "''",
      position: "absolute",
      top: "calc(50% - 15px)",
      right: "-15px",
      borderTop: "15px solid transparent",
      borderBottom: "15px solid transparent",
      borderLeft: "15px solid #3C0E07",
    }
  },
  estContainer: {
    background: "#FBDFA0",
    height: "100%"
  }
}))

const Intro: FC<Props> = (props) => {
  const { stakedInfo } = props
  const [multiplayerTypes, setMultiplayerTypes] = useState("")
  const classes = useStyles()

  useEffect(() => {
    const getMultiplayerTypes = async () => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/multiplayer_info`, {}, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })

      setMultiplayerTypes(data.types.join(", "))
    }

    getMultiplayerTypes()
  }, [])

  return (
    <div className={classes.container}>
      <Container>
        <Grid container columnSpacing={{ md: 2 }} rowSpacing={{ md: 0, xs: 2 }} style={{ marginTop: 30 }}>
          <Grid item xs={12}>
            <div className={classes.leftSection}>
              <Typography variant="h2" className="text-center" style={{ marginBottom: 25, color: "#fff" }}>
                CURRENT STATS
              </Typography>
              <Grid container spacing={2} alignItems="center" justifyContent="space-around">
                <Grid item lg={12} md={12} xs={12}>
                  <div className={classes.smallBox}>
                    <Typography variant="h3" className="typography-center" style={{ color: "#fff" }}>Total NFTs Beted</Typography>
                    <Typography variant="h2" style={{ color: "#f99a00" }}>{stakedInfo.totalKamCnt} </Typography>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <div className={classes.smallBox}>
                    <Typography variant="h3" className="typography-center" style={{ color: "#fff" }}>Your rewards</Typography>
                    <Typography variant="h2" style={{ color: "#7bb664" }}>+{parseFloat(stakedInfo.tokenCnt.toFixed(3))} <span style={{ color: "#7bb664", fontSize: "60%" }}>$ORBZ</span></Typography>
                  </div>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <div className={classes.smallBox}>
                    <Typography variant="h3" className="typography-center" style={{ color: "#fff" }}>Your rewards</Typography>
                    <Typography variant="h2" style={{ color: "#7bb664" }}>+{parseFloat(stakedInfo.tokenCnt.toFixed(3))} <span style={{ color: "#7bb664", fontSize: "60%" }}>$ORBZ</span></Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Intro
