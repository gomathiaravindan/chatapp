import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Stack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import { Text } from '@chakra-ui/react'
import { getSender } from '../../../config/ChatLogics'
import GroupChatModel from './GroupChatModel'
const MyChats = ({ fetchAgain}) => {
  const [loggedUser, setLoggedUser ] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState()
  
  const toast = useToast();
  //const history = useHistory();
  const fetchchats = async()=>{
    try{
      console.log(user.token);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
    };
      const {data} = await axios.get("/api/chats",config);
      console.log(data)
      setChats(data);
    }catch(error){
      toast({
        title: "Error occured",
        description: "Failed to load the chats",
        status:"error",
        isClosable:true,
        position:"top-left",
      });
    }
  }
  
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchchats();
    //eslint-disable-next-line
  },[fetchAgain]);
  return (
    <>
      <Box display={{ base: selectedChat ? "none" : "flex", md: "flex"}}
      flexDir="column"
      alignItems="center"
      padding={3}
      bg="white"
      w={{base:"100%", md:"31%"}}
      borderRadius="lg"
      borderwidth="1px">
      <Box pb={3}
      px={3}
      fontSize={{base: "28px", md:"30px"}}
      fontFamily="Work Sans"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center">
       My Chats
       <GroupChatModel>
         <Button display="flex"
         fontSize={{ base: "17px", md:"10px", lg: "17px"}}
         rightIcon={<AddIcon/>}>
          New Group Chat
         </Button>
       </GroupChatModel>
      </Box>

      <Box display="flex"
      flexDir="column"
      padding={3}
      bg="#F8F8F8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden">
        { chats? (

          <Stack overflowY="scroll">
            {chats.map((chat)=>(
              <Box onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}>
                <Text>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users): chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
    </>
  )
}

export default MyChats
