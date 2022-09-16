import React, {useState} from 'react'
import { Box, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Button, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ModalContent } from '@chakra-ui/react'
import { ChatState } from '../../../Context/ChatProvider'
import UserListItem from '../UserListItem/UserListItem'
import axios from 'axios'
import UserBadgeItem from './UserBadgeItem'
const GroupChatModel = ({children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupchatName, setgroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false)

    const toast = useToast();

    const { user, chats, setChats}= ChatState()

    const handleSearch = async(query)=>{
        setSearch(query)

        if(!query){
            return;
        }
        try{
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`
                },
            };

            const {data} = await axios.get(`/api/user?search=${search}`, config);
            
            setLoading(false);
            setSearchResult(data);
        }catch(err){
            toast({
                title: "Error occured",
                description: "Failed to load the chats",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"top-left",
              });
        }
    }

    const handleSubmit = async()=>{
        if(!groupchatName || !selectedUsers){
            toast({
                title: "Error occured",
                duration:5000,
                isClosable:true,
                description:"Please fill all the fields",
                status:"error"
            });
            return;
        }

        try{

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const {data} = await axios.post(`/api/chats/group`, {
                chatName: groupchatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config)

            setChats([data, ...chats]);
            onClose();
            toast({
                title: "New group chat is created!",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
        }catch(error){
            toast({
                title: "Error occured",
                duration:5000,
                description:error.response.data,
                isClosable:true,
                status:"error"
            });

        }

    }

    const handleGroup = (userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }
    const handleDelete = (userToDelete)=>{
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id))

    }
    return (
        <>
          <span onClick={onOpen}>{children}</span>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontSize="35px"
              fontFamily="Work Sans"
              display="flex"
              justifyContent="center">Create Group Chat</ModalHeader>
              <ModalCloseButton />
              <ModalBody display="flex" flexDir="column" alignItems="center">
                 <FormControl>
                    <Input placeholder="Chat Name" 
                    mb={3}
                    onChange={(e) => setgroupChatName(e.target.value)}/>
                 </FormControl>
                 <FormControl>
                    <Input placeholder="Add Users eg: Lavu, Laxmi" 
                    mb={1}
                    onChange={(e) => handleSearch(e.target.value)}/>
                 </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                 {selectedUsers.map((u)=>(
                     <UserBadgeItem key={user._id}
                     user={u}
                     handleFunction={()=>handleDelete(u)}/>
                 ))}
                 {loading ? <div>Loading</div> : (
                     searchResult?.slice(0,4).map((user)=>(
                         <UserListItem 
                         key={user._id}
                         user={user}
                         handleFunction={()=>handleGroup(user)}/>
                     ))
                 )}
                 </Box>
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                  Create Chat
                </Button>
                
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default GroupChatModel
