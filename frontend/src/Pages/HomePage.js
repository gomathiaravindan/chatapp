import { Box, Container,Text,Tabs,TabPanels,TabList,Tab, TabPanel  } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../Component/Authentication/Login'
import Signup from '../Component/Authentication/Signup'
import { Center } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'
const HomePage = () => {

  const history = useHistory();
  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      console.log("user",user)
      history.push("/chats")
    } 
  },[history]);
  return (
    <Container maxW = 'xl' centerContent>
       <Box
       display="flex"
       justifyContent="center"
       p = {3}
       bg="blackAlpha.400"
       w = "100%"
       m="40px 0 15px 0"
       borderRadius="lg"
       borderWidth="1px"
       >
    <Text color="white" fontSize="4xl" fontFamily="Work sans" padding={"auto"}>
                <Center>Let's Chat</Center>
            </Text>
       </Box>
       <Box bg="blackAlpha.400" w="100%" p ={4} borderRadius="lg" borderwidth="1px" color="white">
       <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList mb="1em">
            <Tab color="white" width="50%">Login</Tab>
            <Tab color="white" width="50%">Sign up</Tab>
        </TabList>
        <TabPanels>
            <TabPanel>
            <Login />
            </TabPanel>
            <TabPanel>
            <Signup />
            </TabPanel>
        </TabPanels>
        </Tabs>
       </Box>
    </Container>
  )
}

export default HomePage
