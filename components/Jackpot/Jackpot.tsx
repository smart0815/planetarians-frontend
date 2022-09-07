import React, { FC, useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { DefaultTheme, makeStyles } from "@mui/styles";
import { styled, alpha } from '@mui/material/styles';
import {
  Container,
  Typography,
  Grid,
  Button,
  List,
  Box,
  FormControl,
  InputBase,
} from "@mui/material";
import Modal from '@mui/material/Modal';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import NFTItem from "./NFTItem"
import { NFT, NFTmap } from "types/metadata"
import Intro from 'components/Intro'

import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import axios from "axios"
import { toast, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SearchIcon from '@mui/icons-material/Search';

import { Transaction, PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { getOrCreateAssociatedTokenAccount } from 'utills/getOrCreateAssociatedTokenAccount'
import { createTransferInstruction } from 'utills/createTransferInstructions'

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
  topBar: {
    padding: '8px',
    background: '#232323',
    border: '1px solid #323232',
    borderRadius: '10px',
  },
  textFieldArrow: {
    color: '#BEBEBE',
  },
  textField: {
    ".MuiList-root": {
      backgroundColor: "lightblue",
    },
    backgroundColor: "lightblue",
  },
  textFieldColor: {
    color: '#BEBEBE',
    '&:before': {
      borderColor: '#BEBEBE',
    },
    '&:after': {
      borderColor: '#BEBEBE',
    },
    ".MuiList-root": {
      backgroundColor: "lightblue",
    },
  },
  mainTitle: {
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '18px',
    lineHeight: '22px',
    textTransform: 'uppercase',
    color: '#EAEAEA',
    marginLeft: '10px',
    "& span": {
      background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
      textShadow: '0px 0px 10px rgba(91, 179, 102, 0.6)',
    }
  },
  subTitle: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '17px',
    lineHeight: '20px',
    color: '#35BD46',
    textShadow: '0px 0px 20px rgba(53, 189, 70, 0.5)',
    textTransform: 'capitalize'
  },
  subTitle2: {
    paddingTop: 0,
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '38px',
    lineHeight: '46px',
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    textShadow: '0px 0px 10px rgba(91, 179, 102, 0.6)'
  },
  subTitle3: {
    marginTop: '15px',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '19px',
    color: '#939393',
  },
  subTitle4: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '36px',
    lineHeight: '43px',
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    textShadow: '0px 0px 10px rgba(91, 179, 102, 0.6)'
  },
  subTitle5: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '29px',
    textTransform: 'uppercase',
    background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    textShadow: '0px 0px 10px rgba(91, 179, 102, 0.6)',
    '& span': {
      background: '#bebebe',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textFillColor: 'transparent',
    }
  },
  transaction: {
    background: '#1B1B1B',
    border: '1px solid #474747',
    borderRadius: '10px',
    minHeight: '600px'
  },
  button: {
    padding: '12px 32px',
    gap: '10px',
    width: '155px',
    height: '48px',
    background: 'linear-gradient(180deg, #41DD55 0%, #41AA38 100%)',
    boxShadow: '0px 0px 10px rgba(91, 179, 102, 0.4)',
    borderRadius: '6px',
    '& span': {
      fontFamily: 'Golos UI',
      fontStyle: 'normal',
      fontWeight: 500,
      textTransform: 'uppercase',
      color: '#21601C',
    }
  },
  wheel: {
    background: '#232323',
    border: '1px solid #474747',
    borderRadius: '10px',
  },
  wheelImg: {
    backgroundImage: `url('wheel.svg')`
  },
  wheelBg: {
    position: 'relative'
  },
  estimateBg: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '45%',
    left: '50%',
  },
  mainPage: {
    marginTop: '30px'
  },
  Ippeeda: {
    background: 'linear-gradient(79.15deg, #D6007B 3.32%, #F14170 72.16%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Renteng: {
    background: 'linear-gradient(14.05deg, #C539C9 10.51%, #F349ED 95.73%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Edugalfo: {
    background: 'linear-gradient(345.27deg, #3C3E7D 10.84%, #6E75B6 96.25%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Idreantes: {
    background: 'linear-gradient(285.22deg, #F06C4E 10.16%, #FFA783 95.47%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Ongendori: {
    background: 'linear-gradient(256.53deg, #F5A354 4.02%, #F7D855 88.55%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Illupp: {
    background: 'linear-gradient(15.37deg, #5C90F5 4.24%, #3534D6 86.89%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Fucladame: {
    background: 'linear-gradient(346.93deg, #AA66D6 4.32%, #7B31C5 88.04%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  Aresti: {
    background: 'linear-gradient(345.27deg, #8CAEF8 10.84%, #6FB9F7 96.25%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px'
  },
  icon: {
    fill: '#A4A6A4',
  },
  selectBox: {
    background: "#2A2B35",
    "& .MuiSelect-outlined": {
      border: "none",
      background: 'transparent',
      paddingLeft: "16px",
      paddingTop: "13.5px",
      paddingBottom: "13.5px",
      color: "#35BD46",
      fontWeight: "normal",
      fontSize: "17px",
      lineHeight: "20px",
      textShadow: '0px 0px 20px rgba(53, 189, 70, 0.5)'
    },
    "& .MuiSelect-select:focus": {
      // borderRadius: "4px"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      // borderColor: "#55576A",
      // borderWidth: "1px"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderWidth: "0px"
    },
    "& svg": {
      fill: "#35BD46"
    },
    "&:hover svg": {
      fill: "#35BD46"
    }
  },
  textarea: {
    width: '100px',
    height: '50px',
    background: '#1B1B1B',
    border: '1px solid #323232',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const currencies = [
  {
    isStaked: false,
    NFT: { symbol: 'All collections' },
    label: 'All collections',
  }
];

const Jackpot: FC<Props> = (props) => {
  const classes = useStyles()
  const { nftList, stakedInfo, setStaked, unstakeAll, getStakedInfo, setLoading, loading } = props
  const { connection } = useConnection()
  const { publicKey, signTransaction, sendTransaction } = useWallet()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currency, setCurrency] = React.useState('EUR');

  const [search, setSearch] = useState();
  const [nftInfo, setNftInfo] = useState([]);
  const [isSelected, setIsSelected] = useState({});
  const [mounted, setMounted] = useState(false);

  const [seriesInfo, setSeriesInfo] = useState([]);
  const [labelInfo, setLabelInfo] = useState([]);

  const labelContent = (e: { category: any; }) => e.category;
  const stakeNFT = async () => {
    setLoading(true)

    //@ts-ignore
    const toastId = toast(`Waiting stake transaction of ${isSelected.NFT.name} `, {
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
        //@ts-ignore
        new PublicKey(isSelected.mint),
        publicKey,
        signTransaction
      )

      console.log("here");
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        publicKey,
        //@ts-ignore
        new PublicKey(isSelected.mint),
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
            //@ts-ignore
            mintAddress: isSelected.mint,
            transactionAddress: signature,
            //@ts-ignore
            floorPrice: isSelected.NFT.properties.floorPrice
          }, {
            headers: {
              "Access-Control-Allow-Origin": "*"
            }
          })
          if (data.success) {
            toast.update(toastId, {
              //@ts-ignore
              render: `${isSelected.NFT.name} Beted!`,
              type: "success"
            })

            // new content
            console.log(data);
            // if (data.walletAddress == publicKey?.toString()) {
            //   setStakedInfo(data)
            // }

            //@ts-ignore
            setStaked(isSelected.mint, true)
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

  useEffect(() => {
    //@ts-ignore
    setNftInfo(nftList)
  }, [nftList])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      console.log("hreee");
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    var seriesArr = [];
    var labelArr = [];
    //@ts-ignore
    var info = stakedInfo.betInfo;
    for (const iterator of info) {
      seriesArr.push(iterator.floorPrice);
      labelArr.push(iterator.userwallet);
    }
    //@ts-ignore
    setSeriesInfo(seriesArr);
    //@ts-ignore
    setLabelInfo(labelArr);

    console.log('----------------------');
    console.log(seriesArr, labelArr);
    console.log('----------------------');
  }, [stakedInfo])


  const chartInfo = {
    series: seriesInfo, 
    options: {
      chart: {
        type: 'donut',
      },
      labels:labelInfo,
      legend: {
        show: true,
        position: "bottom",
        fontSize: '14px',
        offsetX: 20,
        containerMargin: {
          top: 30
        },
        labels: {
          colors: 'white',
          useSeriesColors: false
      },
      },
      responsive: [{
        breakpoint: 0,
        options: {
          chart: {
            width: 400
          },
          legend: {
            show: true,
            position: 'top'
          }
        }
      }]
    },
  };

  const handleSearchChange = (e: any) => {
    if (nftList.length === 0) return;
    const value = e;

    const newFilter = [...nftList].filter(
      (val) =>
        //@ts-ignore
        val.NFT.symbol.toLowerCase().includes(value.toLowerCase()) ||
        //@ts-ignore
        String(val.rating)
          .toLowerCase()
          .includes(value.toLowerCase())
    );

    //@ts-ignore
    setNftInfo(newFilter);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [openModal, setOpenModal] = React.useState(false);
  const modalOpen = () => setOpenModal(true);
  const modalClose = () => setOpenModal(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 960,
    minHeight: 600,
    bgcolor: '#151515',
    border: '1px solid #41DD55',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    overflowY: "scroll",
    maxHeight: "90%",
  };

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

  const [gameType, setGameType] = useState(20);

  const handleChange = (event: any) => {
    setGameType(event.target.value);
  };

  return (
    <Container >
      <Box>
        <Box className={classes.topBar} display='flex' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <img src='monster.svg'></img>
            <Typography className={classes.mainTitle}>Paradise <span>Gaming</span></Typography>
          </Box>
          <Box display='flex' alignItems='center'>
            <Box display='flex'>
              <img src='special.svg'></img>
              <Typography className={classes.subTitle}>Paradise Gaming</Typography>
            </Box>
            <Box display='flex' alignItems='center' ml={2}>
              <img src='soccer.svg'></img>
              <Typography className={classes.subTitle}>Soccer</Typography>
            </Box>
            <Box display='flex' alignItems='center' ml={2}>
              <img src='basket.png'></img>
              <Typography className={classes.subTitle}>Basketball</Typography>
            </Box>
            <Box display='flex' alignItems='center' ml={2}>
              <img src='football.svg'></img>
              <Typography className={classes.subTitle}>American Football</Typography>
            </Box>
            <Box display='flex' alignItems='center' ml={2}>
              <img src='baseball.svg'></img>
              <Typography className={classes.subTitle}>Baseball</Typography>
            </Box>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <Typography className={classes.subTitle}>Others</Typography>
              <img src='select.svg'></img>
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={4} className={classes.mainPage} justifyContent="space-between">
        <Grid item md={3}>
          <Typography className={classes.subTitle2}>
            NFT JACKPOT
          </Typography>
          <Typography className={classes.subTitle3}>1. Connect your wallet</Typography>
          <Typography className={classes.subTitle3}>2. Choose NFTs you want to bet</Typography>
          <Typography className={classes.subTitle3}>3. Get luck and win the whole pot</Typography>
          <Button style={{ marginTop: '30px' }} className={classes.button} onClick={modalOpen} variant="outlined" disabled={loading}><span>MAKE A BET</span></Button>
          <Modal
            open={openModal}
            onClose={modalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item md={4}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      //@ts-ignore
                      onChange={event => handleSearchChange(event.target.value)}
                      placeholder="Search…"
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </Search>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    id="standard-select-currency-native"
                    select
                    value={currency}
                    onChange={handleSelectChange}
                    SelectProps={{
                      native: true,
                      MenuProps: {
                        className: classes.textField,
                      },
                    }}
                    variant="standard"
                    inputProps={{
                      classes: {
                        icon: classes.textFieldArrow,
                      },
                    }}
                    InputProps={{
                      className: classes.textFieldColor,
                    }}
                    defaultValue="color"
                  >
                    {/* {currencies.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))} */}
                    {
                      //@ts-ignore
                      nftList.filter((e) => !e.isStaked).map((nft, index) => {
                        return (
                          <option key={index} value={index}>
                            {
                              //@ts-ignore
                              nft.NFT.symbol
                            }
                          </option>
                        )
                      })
                    }
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <Button className={classes.button} onClick={stakeNFT} variant="outlined" disabled={loading}><span>MAKE A BET</span></Button>
                </Grid>
              </Grid>
              <Grid container mt={3}>
                {
                  //@ts-ignore
                  nftInfo.filter((e) => !e.isStaked).map((nft) => {
                    //@ts-ignore
                    return <Grid item md={2} mt={1} onClick={e => setIsSelected(nft)}>
                      <NFTItem
                        nftData={nft}
                        //@ts-ignore
                        setSelect={nft.NFT.symbol == isSelected.NFT?.symbol ? true : false}
                        setStaked={setStaked}
                        setLoading={setLoading}
                        loading={loading}
                      />
                    </Grid>
                  })
                }
              </Grid>
            </Box>
          </Modal>
          <Grid className={classes.transaction} mt={5} mr={2}></Grid>
        </Grid>
        <Grid item md={9} className={classes.wheel}>
          <Box display="flex" justifyContent='center' className={classes.wheelBg} mt={3}>
            {/* <img src="wheel.svg" alt="" /> */}
            {mounted === true &&
              <>
                <Chart options={chartInfo.options} series={chartInfo.series} type="donut" width="650" />
              </>
            }
            {/* <img src="totalWheel.svg" className={classes.estimateBg} alt="" /> */}
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" className={classes.estimateBg}>
              <Box display="flex" alignItems="center" flexDirection="column">
                <Typography className={classes.subTitle3}>Time</Typography>
                <Box className={classes.textarea}>
                  <Typography className={classes.subTitle}>00:00</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" flexDirection="column" mt={3}>
                <Typography className={classes.subTitle2}>
                  {//@ts-ignore
                    stakedInfo.totalPrice
                  } $SOL
                </Typography>
                <Typography className={classes.subTitle3}>Current Pot</Typography>
              </Box>
              <Box display="flex" alignItems="center" flexDirection="column" mt={3}>
                <Box className={classes.textarea}>
                  <Typography className={classes.subTitle}>80/
                    {//@ts-ignore
                      stakedInfo.nftLength
                    }
                  </Typography>
                </Box>
                <Typography className={classes.subTitle3}>NFTs</Typography>
              </Box>
            </Box>
          </Box>
          {/* <Box display='flex' justifyContent='center' mb={20} mt={5}>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Ippeeda}>Ippeeda</Typography>
              <Typography className={classes.subTitle3}>15,4%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Renteng}>Renteng</Typography>
              <Typography className={classes.subTitle3}>9%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Edugalfo}>Edugalfo</Typography>
              <Typography className={classes.subTitle3}>32,5%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Idreantes}>Idreantes</Typography>
              <Typography className={classes.subTitle3}>5,4%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Ongendori}>Ongendori</Typography>
              <Typography className={classes.subTitle3}>14,3%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Illupp}>Illupp</Typography>
              <Typography className={classes.subTitle3}>10,1%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Fucladame}>Fucladame</Typography>
              <Typography className={classes.subTitle3}>8,1%</Typography>
            </Box>
            <Box display='flex' flexDirection='column' mr={3}>
              <Typography className={classes.Aresti}>Aresti</Typography>
              <Typography className={classes.subTitle3}>5,25%</Typography>
            </Box>
          </Box> */}
        </Grid>
      </Grid>
      <Box mt={4} pb={10}>
        <Box>
          <Typography className={classes.subTitle4}>
            TOTAL POOL
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between' mt={4} mb={3}>
          <Typography className={classes.subTitle5}>80 <span>NFTS</span></Typography>
          <Typography className={classes.subTitle5}>{
            //@ts-ignore
            stakedInfo.totalPrice} <span>$SOL</span></Typography>
          <Typography className={classes.subTitle5}>{
            //@ts-ignore
            stakedInfo.nftLength} <span>PLAYERS</span></Typography>
        </Box>
        <Grid container>
          {
            nftList.filter((e) => e.isStaked).map((nft) => {
              return (<Grid item md={2}>
                <NFTItem
                  nftData={nft}
                  setStaked={setStaked}
                  setLoading={setLoading}
                  loading={loading}
                  setSelect={undefined} />
              </Grid>)
            })
          }
        </Grid>
      </Box>
    </Container>
  )
}

export default Jackpot
