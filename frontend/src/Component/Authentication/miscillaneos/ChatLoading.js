import React from 'react'
import { Stack, Skeleton } from '@chakra-ui/react'
const ChatLoading = () => {
  return (
   <>
     <Stack>
         <Skeleton height="45px"></Skeleton>
     </Stack>
   </> 
  )
}

export default ChatLoading
