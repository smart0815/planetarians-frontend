import React, { FC, useState, useEffect } from "react"
import { makeStyles } from "@mui/styles"
import {
  Container,
  Typography,
  Grid,
  Button,
  List
} from "@mui/material"
import NFTItem from "./NFTItem"
import { NFT, NFTmap } from "types/metadata"
import Intro from 'components/Intro'

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import axios from "axios"
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
  nftList: NFTmap[]
  stakedInfo: () => void
  setStaked: (mintAddr: string, status: boolean) => void
  // stakeAll: () => void
  unstakeAll: () => void
  getStakedInfo: () => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "40px 80px",
    background: "#773526",
    borderRadius: 15,
    position: "relative",
    top: -50,
    '@media (max-width:960px)': {
      padding: "20px"
    }
  },
  claimBtn: {
    width: "100%",
    padding: 20,
    background: "linear-gradient(2.85deg, #EA6A3D -40.83%, #DF402B 99.1%)",
    color: "white"
  },
  stakeBtn: {
    width: "100%",
    padding: 20,
    background: "linear-gradient(360deg, #9D74FF 0%, #8957FF 100%)",
    color: "white"
  },
  unstakeBtn: {
    width: "100%",
    padding: 20,
    background: "linear-gradient(360deg, #9D74FF 0%, #8957FF 100%)",
    color: "white"
  },

}))

const Staking: FC<Props> = (props) => {
  const classes = useStyles()
  const { nftList, stakedInfo, setStaked, unstakeAll, getStakedInfo, setLoading, loading } = props
  const { publicKey, signTransaction } = useWallet()

  const calcOrder = (data: any) => {
    const symbol = data.NFT.symbol
    let number: any = parseInt(data.NFT.name.split("#")[1])
    if (symbol == "MEGAM1") {
      number += 10000
    } else if (symbol != "KAM1") {
      number += 20000
    }
    return number
  }

  nftList.sort((a: any, b: any) => {
    return calcOrder(a) - calcOrder(b)
  })

  const claimToken = async () => {
    if (!publicKey || !signTransaction) return

    const toastId = toast(`Waiting claim token`, {
      type: "info",
      theme: "dark",
      position: "bottom-left",
      transition: Zoom,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      autoClose: false
    })

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/reward_token`, {
      walletAddress: publicKey.toString(),
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })

    await getStakedInfo()

    if (data.success) {
      toast.update(toastId, {
        render: `Claimed ${data.success} token`,
        type: "success"
      })
    } else {
      toast.update(toastId, {
        render: "You don't have any rewarded token!",
        type: "error"
      })
    }
  }

  return (

    <section className="innerPage">
      {/* {props.children} */}
      <p className="text-center" style={{ padding: "20px", fontSize: "22px" }}>Outer Cosmos</p>
      <Typography className="text-center" variant="overline" display="block" gutterBottom>
        Stake Planetarian Founders and Planetarian Companions to earn $ORB
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={4} xs={12}>
          <div style={{ padding: '15px 60px' }}>
            <p className="text-center" style={{ color: '#38d7ab' }}>UNSTAKED</p>
            <Typography className="text-center" variant="overline" display="block" gutterBottom>
              Founder and Companion
            </Typography>
          </div>
          <div className="inPageContainer">
            <List className="listScroll">
              <Grid container spacing={1} className="gridScroll">
                {
                  nftList.filter((e) => !e.isStaked).map((nft) => {
                    return (
                      <Grid item md={6} sm={6} xs={12}>
                        <NFTItem
                          nftData={nft}
                          setStaked={setStaked}
                          setLoading={setLoading}
                          loading={loading}
                        />
                      </Grid>
                    )
                  })
                }
                {/* {nft && nft.length > 0 ? (
                nft.filter(f => (f.NFT.name.toLowerCase().includes(filter.toLowerCase()) || filter.toLowerCase() === '') && !f.isStaked).map((element, index) => {
                  return (
                    <Grid item md={6} sm={6} xs={12}><NFTCard element={element} key={index} /></Grid>);
                })
              ) : ('')} */}

              </Grid>
            </List>
          </div>
          <div className="text-center" style={{ marginBottom: '15px' }}>
            <Button className="cosmic" onClick={claimToken} variant="outlined" disabled={loading}>CLAIM MY REWARDS</Button>
          </div>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Intro stakedInfo={stakedInfo} />
          {/* <Wallet /> */}
        </Grid>
        <Grid item sm={4} xs={12}>
          <div style={{ padding: '15px 60px' }}>
            <p className="text-center" style={{ color: '#38d7ab' }}>STAKED</p>
            <Typography className="text-center" variant="overline" display="block" gutterBottom>
              Expedition for $ORB
            </Typography>
          </div>
          <div className="inPageContainer">
            <List style={{ height: 515, overflow: 'auto' }}>
              <Grid container>
                {
                  nftList.filter((e) => e.isStaked).map((nft) => {
                    return (
                      <Grid item md={6} sm={6} xs={12}>
                        <NFTItem
                          nftData={nft}
                          setStaked={setStaked}
                          setLoading={setLoading}
                          loading={loading}
                        />
                      </Grid>
                    )
                  })
                }
              </Grid>
            </List>
          </div>
          <div className="text-center" style={{ marginBottom: '15px' }}>
            <Button className="cosmic" onClick={unstakeAll} variant="outlined">Unstake all NFTs</Button>
          </div>
          <div className="text-center" style={{ marginBottom: '15px' }}>
          </div>
        </Grid>
      </Grid>
    </section>
  )
}

export default Staking
