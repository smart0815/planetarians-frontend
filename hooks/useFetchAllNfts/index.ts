import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz"
import { useState, useEffect } from "react"
import * as anchor from "@project-serum/anchor"
import axios from "axios"
import { PublicKey } from "@solana/web3.js"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Metadata } from "@metaplex-foundation/mpl-token-metadata"
import { NFT, NFTmap } from "../../types/metadata"
import TutorialDataService from "./tutorial.service";

const useFetchAllNfts = (setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  const wallet = useWallet()
  const [nftList, setNFTList] = useState<NFTmap[]>([])
  const connection = new anchor.web3.Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_HOST!)

  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true)

      if (wallet.connected && !!process.env.NEXT_PUBLIC_NFT_UPDATE_AUTHORITY) {
        try {
          setNFTList([])

          const nftData = await TutorialDataService.getAll(wallet.publicKey?.toString());
          console.log(nftData.data);
          if (nftData.data.length) {
            //@ts-ignore
            nftData.data.filter(element=>!element.animation_url).forEach(async (element) => {
              setNFTList((nftList) => [...nftList, { NFT: element, mint: element.mintkey, isStaked: false }])
            })
          }

          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/staked_nfts`, {
            walletAddress: wallet.publicKey?.toString()
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })

          data.map(async (mintAddr: string) => {
            const mintPubkey = new PublicKey(mintAddr)
            const tokenmetaPubkey = await Metadata.getPDA(mintPubkey)
            const tokenmeta = await Metadata.load(connection, tokenmetaPubkey)
            const { data } = await axios.get<NFT>(tokenmeta.data.data.uri)
            setNFTList((nftList) => [...nftList, { NFT: data, mint: mintAddr, isStaked: true }])
          })

          setLoading(false)
        } catch (err) {
          console.log(err)
        }
      } else {
        setNFTList([])
        setLoading(false)
      }
    }
    fetchNFTs()
  }, [wallet.publicKey, wallet.connected])

  return { nftList, setNFTList }
}

export default useFetchAllNfts