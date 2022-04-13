import React, { FC, useEffect, useState } from 'react'
import { makeStyles, useTheme } from "@mui/styles"
import {
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
  }
}))

const NFTItem: FC<Props> = (props) => {
  const classes = useStyles()
  const { nftData, setStaked, setLoading, loading } = props

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

      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        new PublicKey(nftData.mint),
        publicKey,
        signTransaction
      )
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
        // createTransferInstruction(
        //   fromTokenAccount.address, // source
        //   toTokenAccount.address, // dest
        //   publicKey,
        //   1,
        //   [],
        //   TOKEN_PROGRAM_ID
        // )
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
          const res = await axios.get(`https://public-api.solscan.io/transaction/${signature}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (res.status === 200) {
            // const signed = await signTransaction(transaction)
            // const signature = await connection.sendRawTransaction(signed.serialize())

            // await connection.confirmTransaction(signature)
            let nftType = "";
            if (nftData.NFT.name.includes("Planetarians")) {
              nftType = "Planetarians"
            } else if (nftData.NFT.name.includes("Pet")) {
              nftType = "Pet"
            }

            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/stake_nft`, {
              walletAddress: publicKey.toString(),
              mintAddress: nftData.mint,
              transactionAddress: signature,
              nftType
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
          }
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
      <div className="nftBox">
        <img src={nftData.NFT.image} style={{ width: "100%" }} />
        {
          nftData.isStaked ?
            <Button variant="contained" className={`${classes.btn} ${classes.unstakeBtn}`} onClick={unstakeNFT} disabled={loading}>unstake</Button>
            :
            <Button variant="contained" className={classes.btn} onClick={stakeNFT} disabled={loading}>
              stake
            </Button>
        }
      </div>
    </>
  )
}

export default NFTItem
