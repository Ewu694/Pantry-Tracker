'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase"
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { collection, query, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2E4E35', 
    },
    secondary: {
      main: '#ff0000', 
    },
  },
});

const RemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff0000',
  '&:hover': {
    backgroundColor: '#330000',
  },
}));

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('') 

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const removeItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnaps = await getDoc(docRef)

    if(docSnaps.exists()){
      const {quantity} = docSnaps.data()
      if(quantity === 1)
        await deleteDoc(docRef)
      else
        await setDoc(docRef, {quantity: quantity - 1})
    }
    await updateInventory()
  }

  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnaps = await getDoc(docRef)

    if(docSnaps.exists()){
      const {quantity} = docSnaps.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else
      await setDoc(docRef, {quantity : 1})
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <ThemeProvider theme = {darkTheme}> 
      <Box width = '100vw' height = '100vh' display = 'flex' flexDirection = 'column' justifyContent = 'center' alignItems = 'center' gap = {2} sx = {{ bgcolor: 'background.default' }}> 
      <TextField
        id="filled-search"
        label="Search field"
        type="search"
        variant="filled"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: isFocused ? '#2E4E35' : 'inherit' }} />
            </InputAdornment>
          ),
        }}
      />
      <Modal open={open} onClose={handleClose}>
        <Box position='absolute' top='50%' left='50%' width={400} boxShadow={24} p={4} display='flex' flexDirection='column' gap={3} sx={{transform: 'translate(-50%, -50%)'}} bgcolor = '#222222'>
          <Typography variant='h6' textAlign= 'center' color = 'white'>Add Item</Typography>
          <Stack width='100%' direction='row' spacing={2}>
            <TextField variant='outlined' fullWidth value={itemName} onChange={(e) => {setItemName(e.target.value)}} />
            <Button color ='primary' variant='outlined' onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
        <Box border='1px solid #333' width='800px'>
          <Box height='80px' display='flex' alignItems='center' justifyContent='center' bgcolor='#222222' border = '1px solid #333' space = {3} >
            <Typography variant='h3' color='white'>
              Inventory Items 
            </Typography>
            <Typography color = 'white' variant='h4' textAlign='center' width='5%'>|</Typography>
            <Button color = 'primary' variant = 'contained' onClick={() => {
              handleOpen()
            }}
            >
              Add Item
            </Button>
          </Box>
          <Box>
            <Box width='100%' height='50px' display='flex' alignItems='center' bgcolor='#222222' color='white' borderBottom='1px solid #333'>
              <Typography variant='h4' textAlign='center' width='30%'>Items</Typography>
              <Typography variant='h4' textAlign='center' width='5%'>|</Typography>
              <Typography variant='h4' textAlign='center' width='25%'>Quantity</Typography>
              <Typography variant='h4' textAlign='center' width='5%'>|</Typography>
              <Typography variant='h4' textAlign='center' width='35%'>Add/Remove</Typography>
            </Box>
            {inventory.map((item) => (
              <Box key={item.name} width='100%' height='50px' display='flex' alignItems='center' bgcolor='#222222' color='white' borderBottom='1px solid #333'>
                <Typography variant='h5' textAlign='center' width='30%' sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}  
                </Typography>
                <Typography variant='h4' textAlign='center' width='5%'>|</Typography>
                <Typography variant='h5' textAlign='center' width='25%'>
                  {item.quantity}  
                </Typography> 
                <Typography variant='h4' textAlign='center' width='5%'>|</Typography>
                <Box width='35%' display='flex' justifyContent='center'>
                  <Stack direction='row' spacing={1}>
                    <Button size="small" variant='contained' onClick={() => addItem(item.name)}>Add</Button>
                    <RemoveButton size="small" color='secondary' variant='contained' onClick={() => removeItem(item.name)}>Remove</RemoveButton>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>  
    </ThemeProvider>
  );
}
 