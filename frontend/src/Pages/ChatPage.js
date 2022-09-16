import React, {useState} from 'react'
import { Box } from '@chakra-ui/react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../Component/Authentication/miscillaneos/SideDrawer'
import MyChats from '../Component/Authentication/miscillaneos/MyChats'
import ChatBox from '../Component/Authentication/miscillaneos/ChatBox'
const ChatPage = () => {

  const { user } = ChatState()
  const [fetchAgain, setFetchAgain] = useState(false)
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer/>}
      <Box
      display="flex"
      justifyContent='space-between'
      w='100%'
      h='91.5vh'
      padding='10px'
      color="black">
        {user && <MyChats fectchAgain={fetchAgain} />}
        {user && <ChatBox fectchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
     
  )
}

export default ChatPage
