import React,{useState} from 'react'
import { Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
const Login = () => {
  
    const [email, setEmail] = useState();
    const [password, setPwd] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const history = useHistory()
   const handleClick = ()=>{
        setShow(!show)
    }
    const submitHandler = async() =>{
        setLoading(true)
        if(!email || !password){
            toast({
                title: "Please fill the required fields",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "bottom",
            })
            setLoading(false);
            return;
        }
       try{
        const config = {
            headers: {
                "Content-type": "application/json"
            },
        };
           const { data } = await axios.post("/api/user/login",
               {email,password},
               config
           );
           console.log(data);
           toast({
            title: "Welcome to your profile",
            status: "success",
            duration: 5000,
            isClosable:true,
            position: "top"
        });
        localStorage.setItem('userInfo',JSON.stringify(data));
        history.push("/chats")
         setLoading(false);
         
       }catch(err){
        toast({
            title: "Error occured",
            description: err.response.data.message,
            status: "error",
            duration: 5000,
            isClosable:true,
            position: "top"
        });
        setLoading(false)
       }
    }

    const handleLogin = (email)=>{
        return setEmail(email)
    }
  return (

   <VStack spacing="5px" color="white">
       
       <FormControl id="email1" isRequired>
           <FormLabel>Email</FormLabel>
            <Input color="white"
            value={email}
            onChange={(e)=>handleLogin(e.target.value)}/>
            
       </FormControl>
       <FormControl id="pwd1" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input color="white"
            type={show ? "text": "password"}
            value={password}
            onChange={(e)=>setPwd(e.target.value)}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick} bgColor='green.100' color="blackAlpha.600">
                {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>   
       </FormControl>
       <Button
       bg="green.100"
       width="100%"
       color="green"
       style={{marginTop:15}}
       onClick={submitHandler}
       isLoading = {loading}
       >
       Login
       </Button>
       <Button
       variant="solid"
       bg="#FF6433"
       width="100%"
       onClick={()=>{
           setEmail("guestemail@example.com");
           setPwd("testpwd");
       }}>
        Guest User Credentails
       </Button>
   </VStack>
  )
}

export default Login
