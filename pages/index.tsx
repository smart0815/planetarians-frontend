import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { MagicSpinner } from "react-spinners-kit"

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import axios from "axios"
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import useFetchAllNfts from "hooks/useFetchAllNfts"
import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'

import Layout from 'components/Layout'
import Intro from 'components/Intro'
import { NFTmap } from 'types/metadata'
import Jackpot from 'components/Jackpot'

const Home: NextPage = () => {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const [loading, setLoading] = useState(false)
  const [stakedInfo, setStakedInfo] = useState<any>()

  const { nftList, setNFTList } = useFetchAllNfts(setLoading)

  const setStaked = (mintAddr: any, status: boolean) => {
    setNFTList((nftList: NFTmap[]) => {
      nftList.forEach((nft: NFTmap) => {
        if (nft.mint == mintAddr) {
          nft.isStaked = status
        }
      })

      return nftList
    })

    getStakedInfo()
  }

  const unstakeAll = async () => {
    if (!publicKey || !signTransaction) return

    setLoading(true)

    const toastId = toast(`Waiting unstake transaction of all nfts`, {
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
    console.log(publicKey.toString());
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/unstake_all_nfts`, {
      walletAddress: publicKey.toString(),
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
    if (data.mintAddresses.length) {
      await getStakedInfo()

      toast.update(toastId, {
        render: `${data.mintAddresses.length} nfts are unstaked!`,
        type: "success"
      })
      setNFTList((nftList: NFTmap[]) => {
        nftList.forEach((nft: NFTmap) => {
          if (data.mintAddresses.includes(nft.mint)) {
            nft.isStaked = false
          }
        })
        return nftList
      })
    } else {
      toast.update(toastId, {
        render: `Something went wrong!`,
        type: "error"
      })
    }

    setLoading(false)
  }

  const getStakedInfo = async () => {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/staked_info`, {
      walletAddress: publicKey?.toString()
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
    if (data.walletAddress == publicKey?.toString()) {
      setStakedInfo(data)
    }
  }

  useEffect(() => {
    getStakedInfo()
  }, [publicKey])

  return (
    <>
      {
        loading && <div className="loading-container">
          <MagicSpinner size={170} color="#2bc8df" />
        </div>
      }
      {stakedInfo &&
        <Layout>
          <Jackpot
            nftList={nftList}
            stakedInfo={stakedInfo}
            setStaked={setStaked}
            // stakeAll={stakeAll}
            unstakeAll={unstakeAll}
            getStakedInfo={getStakedInfo}
            setLoading={setLoading}
            loading={loading}
          />
        </Layout>
      }
      <ToastContainer />
    </>
  )
}

export default Home
