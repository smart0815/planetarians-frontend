import React, { FC, useEffect, useState } from 'react'
import { makeStyles, useTheme } from "@mui/styles"
import {
  Box,
  Grid,
  Typography,
  Button
} from '@mui/material'
import { NFTmap } from "types/metadata"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'

import axios from "axios"
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface Props {
  nftData: NFTmap
  setSelect: any
  setStaked: (mintAddr: string, status: boolean) => void
  setLoading: (loading: boolean) => void
  loading: boolean
}

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#4A120A"
  },
  btnContainer: {
    padding: "15px 40px",
    background: "#280903",
    textAlign: "center"
  },
  btn: {
    width: "100%",
    background: "#601D10",
    padding: 15,
    color: "white",
    fontWeight: "bold"
  },
  unstakeBtn: {
    background: "linear-gradient(360deg, #9D74FF 0%, #8957FF 100%)"
  },
  symbol: {
    marginBottom: '5px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '12px',
    color: '#EAEAEA',
  },
  collectionName: {
    marginBottom: '5px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '12px',
    color: '#636363',
  },
  floorPrice: {
    background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '12px',
    textShadow: '0px 0px 10px rgba(91, 179, 102, 0.6)'
  },
}))

const NFTItem: FC<Props> = (props) => {
  const classes = useStyles()
  const { nftData, setStaked, setSelect, setLoading, loading } = props

  const { connection } = useConnection()
  const { publicKey, signTransaction, sendTransaction } = useWallet()

  const stakeNFT = async () => {
    setLoading(true)

    const toastId = toast(`Waiting stake transaction of ${nftData.NFT.name} `, {
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

    try {
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError()

      const toPublicKey = new PublicKey(process.env.NEXT_PUBLIC_LOCKED_WALLET!)
      console.log(publicKey);
      console.log(nftData.mint);
      console.log(process.env.NEXT_PUBLIC_LOCKED_WALLET);
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(nftData.mint),
        publicKey,
        signTransaction
      )

      console.log("here");
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(nftData.mint),
        toPublicKey,
        signTransaction
      )
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          fromTokenAccount.address,
          toTokenAccount.address,
          publicKey,
          [],
          1
        )
      ).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports: LAMPORTS_PER_SOL * parseFloat(process.env.NEXT_PUBLIC_TRANSACTION_FEE!)
        })
      )
      // const blockHash = await connection.getLatestBlockhash()
      // transaction.feePayer = publicKey
      // transaction.recentBlockhash = blockHash.blockhash

      const signature = await sendTransaction(transaction, connection)
      const response = await connection.confirmTransaction(signature, 'processed')
      if (signature) { // check the signature
        try {
          // const res = await axios.get(`https://public-api.solscan.io/transaction/${signature}`, {
          //   method: "GET",
          //   headers: {
          //     'Content-Type': 'application/json'
          //   }
          // })
          // if (res.status === 200) {
          // const signed = await signTransaction(transaction)
          // const signature = await connection.sendRawTransaction(signed.serialize())

          // await connection.confirmTransaction(signature)
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/stake_nft`, {
            walletAddress: publicKey.toString(),
            mintAddress: nftData.mint,
            transactionAddress: signature,
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })
          if (data.success) {
            toast.update(toastId, {
              render: `${nftData.NFT.name} staked!`,
              type: "success"
            })

            setStaked(nftData.mint, true)
          } else {
            toast.update(toastId, {
              render: `Something went wrong!`,
              type: "error"
            })
          }
          // }
        } catch (error) {
          console.log(error)
        }
      }
    } catch (error: any) {
      console.log(error)

      toast.update(toastId, {
        render: `Something went wrong!`,
        type: "error"
      })
    }

    setLoading(false)
  }

  const unstakeNFT = async () => {
    if (!publicKey || !signTransaction) return

    setLoading(true)

    const toastId = toast(`Waiting unstake transaction of ${nftData.NFT.name} `, {
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

    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/unstake_nft`, {
      walletAddress: publicKey.toString(),
      mintAddress: nftData.mint,
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
    if (data.success) {
      toast.update(toastId, {
        render: `${nftData.NFT.name} unstaked!`,
        type: "success"
      })

      setStaked(nftData.mint, false)
    } else {
      toast.update(toastId, {
        render: `Something went wrong!`,
        type: "error"
      })
    }

    setLoading(false)
  }

  return (
    <>
      <div className={nftData.isStaked ? "nftStakedBox" : setSelect ? "nftStakedAnim" : "nftUnstakedBox"}>
        <img src={nftData.NFT.image} />
        {
          !nftData.isStaked ?
            // <Button variant="contained" className={classes.btn} onClick={stakeNFT} disabled={loading}>
            //   Bet
            // </Button>
            <>
              <Box p={1}>
                <Typography className={classes.symbol}>{nftData.NFT.symbol}</Typography>
                <Typography className={classes.collectionName}>{nftData.NFT.collection.name}</Typography>
                <Box display='flex' justifyContent='space-between'>
                  <Typography className={classes.floorPrice}>Floor</Typography>
                  <Typography className={classes.floorPrice}>{
                    //@ts-ignore
                    nftData.NFT.properties.floorPrice}</Typography>
                </Box>
              </Box>
            </>
            :
            <Button variant="contained" className={`${classes.btn} ${classes.unstakeBtn}`} onClick={unstakeNFT} disabled={loading}>unstake</Button>
        }
      </div>
    </>
  )
}

export default NFTItem
