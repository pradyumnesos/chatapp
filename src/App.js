import {Box,Button,Container,Input,VStack,HStack} from '@chakra-ui/react'; 
import Message from './Components/Message';
import { useEffect, useRef, useState } from 'react';
import {signOut,onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {app} from './firebase';
import {getFirestore,addDoc, collection, serverTimestamp,onSnapshot,query,orderBy} from 'firebase/firestore';

const auth=getAuth(app);
const db=getFirestore(app);
const loginHandler = ()=>{
   const provider = new GoogleAuthProvider();
   signInWithPopup(auth,provider);
}
const logoutHandler = ()=>{
  signOut(auth);
}

function App() {
  
  const [user,setuser]=useState(false);
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const divForScroll= useRef(null);
  useEffect(()=>{
    const q=query(collection(db,"Messages"),orderBy("createdAt","asc"));
    const unsubscribe=onAuthStateChanged(auth,(data)=>{
      console.log(data);
       setuser(data);
    })
    const unsubscribeForMessage=onSnapshot(q,(snap)=>{
       setMessages(snap.docs.map((item)=>{
        const id=item.id;
        return {id,...item.data() };
       }));
    });
    return ()=>{
      unsubscribe();
      unsubscribeForMessage();
    }
  },[])
  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      setMessage("");
      await addDoc(collection(db,"Messages"),{
         text: message,
         uid: user.uid,
         uri:user.photoURL,
         uname:user.displayName,
         createdAt:serverTimestamp()
      });
      
      divForScroll.current.scrollIntoView({behaviour: "smooth"});
    }catch(error){
      alert(error);
    }
    }
  return (
    <Box bg="red.50">
      {
        user?(<Container h="100vh" bg="white">
        <VStack h="full" paddingY="4">
          <Button w="full" colorScheme="red" onClick={logoutHandler}>Logout</Button>
           <VStack h="full" width="full" overflowY="auto" css={{"&::-webkit-scrollbar":{
            display:"none"
           }}}>
           {
              messages.map((item)=>{
                console.log(item);
                return <Message
                key={item.id} 
                text={item.text} 
                user={item.uid===user.uid?"me":"other"} 
                uri={item.uri}
                name={item.uname} />
              }
              )
           }
             <div ref={divForScroll}></div>
            </VStack>
          
            <form onSubmit={submitHandler} style={{width:"100%"}}>
                 <HStack>
                 <Input value={message} onChange={(e)=>{
                  setMessage(e.target.value)
                 }}placeholder='Enter a message...'/>
                 <Button colorScheme="purple" type="submit">Send</Button>
                 </HStack>
            </form>
               
        </VStack>
       
     </Container>):(<VStack bg="white" h="100vh" justifyContent="center">
      <Button colorScheme='purple' onClick={loginHandler}>Sign In With Google</Button>
     </VStack>)
      }
      
    </Box>
  );
}

export default App;
