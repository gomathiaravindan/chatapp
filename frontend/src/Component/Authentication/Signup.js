import { Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import React, {useState} from 'react'
import { Button } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPwd] = useState();
    const [confirmpwd, setConfirmPwd] = useState();
    const [picture, setPicture] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const history = useHistory()
   const handleClick = ()=>{
        setShow(!show)
    }

    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined) {
            toast ({
                title: "Please choose an image",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            setLoading(false)
            return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append('file',pics);
            data.append("upload_preset","Let's_talk")
            data.append("cloud_name","let-s-talk")
            fetch("https://api.cloudinary.com/v1_1/let-s-talk/image/upload",{
                method: 'post',
                body: data
            }).then((res) => res.json())
            .then(data => {
                setPicture(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            })

        }
        else {
            toast({
                title: "Please choose an image",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }

    }
    const submitHandler = async () =>{
        setLoading(true);
        console.log(name,email,password,confirmpwd)
        if(!name || !email || !password || !confirmpwd){
            toast({
                title: "Please fill the required fields",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "top"
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpwd){
            toast({
                title: "Please fill the correct password",
                status: "warning",
                duration: 5000,
                isClosable:true,
                position: "top"
            });
            
            return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user/", { name, email, password, picture},
            config);
            console.log("data",data);
            toast({
                title: "Your registration is completed",
                status: "success",
                duration: 5000,
                isClosable:true,
                position: "top"
            });
            localStorage.setItem('userInfo',JSON.stringify(data));
            setLoading(false);
            history.push('/chats')
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
  return (

   <VStack spacing="5px" color="white">
       <FormControl id="firstName" isRequired>
           <FormLabel>Name</FormLabel>
            <Input color="white"
            onChange={(e)=>setName(e.target.value)}/>
            
       </FormControl>
       <FormControl id="email" isRequired>
           <FormLabel>Email</FormLabel>
            <Input color="white"
            onChange={(e)=>setEmail(e.target.value)}/>
            
       </FormControl>
       <FormControl id="pwd" isRequired>
           <FormLabel>Password</FormLabel>
           <InputGroup>
           <Input color="white"
            type={show ? "text": "password"}
            onChange={(e)=>setPwd(e.target.value)}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick} bgColor='green.100' color="blackAlpha.600">
                {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>   
       </FormControl>
       <FormControl id="confirmpwd" isRequired>
           <FormLabel>Confirm Password</FormLabel>
           <InputGroup>
           <Input color="white"
            type={show ? "text": "password"}
            onChange={(e)=>setConfirmPwd(e.target.value)}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick} bgColor='green.100' color="blackAlpha.600">
                {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
            </InputGroup>
            
       </FormControl>
        <FormControl id="pic">
            <FormLabel>Upload Picture</FormLabel>
            <Input type="file"
            padding={1.5}
            accept='image/*'
            onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
      
       <Button
       bg="#26619c"
       width="100%"
       color="white"
       style={{marginTop:15}}
       onClick={submitHandler}
       isLoading  = {loading}
       >
        Sign up
       </Button>
   </VStack>
  )
}

export default Signup
