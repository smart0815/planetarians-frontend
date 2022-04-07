import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Navbar from 'components/Navbar'

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = (props) => {

  const { children } = props

  return (
    <Box>
      <Navbar />
      {
        children
      }
    </Box>
  )
}

export default Layout
