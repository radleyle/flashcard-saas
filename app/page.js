import Image from 'next/image'
import getStripe from '@/utils/get-stripe'
import Link from 'next/link' // Import the Link component

import {Container} from '@mui/material'
import Head from 'next/head'
import { Box, AppBar, Toolbar, Typography, Button, Grid, UserButton } from '@mui/material'

export default function Home() {
    return (            
        <Container>
            <Head>
                <title>Flashcard Creator</title>
                <meta name="description" content="Create flashcards for your next quiz or test" />
            </Head>

            <Box
                sx={{
                    textAlign: 'center',
                    my: 4,
                }}
            >
                <Typography variant="h2" gutterBottom>
                    Welcome to Flashcard Saas
                </Typography>
                <Typography variant="h5" gutterBottom>
                    {''}
                    The easiest way to create flashcards for your next quiz or test
                </Typography>
                {/* <Button variant="contained" color="primary" sx={{mt: 2}}>
                    Get Started
                </Button> */}
                <Link href="/generate" passHref>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Get Started
                    </Button>
                </Link>
            </Box>
            <Box sx={{mt: 6}}>
                <Typography variant="h4" gutterBottom>
                    Features 
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Easy to use
                        </Typography>
                        <Typography>
                            {''}
                            Create flashcards in minutes.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Smart Flashcards
                        </Typography>
                        <Typography>
                            {''}
                            Our AI intelligently organizes your flashcards into categories and subcategories.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" gutterBottom>
                            Accessible anywhere
                        </Typography>
                        <Typography>
                            {''}
                            Access your flashcards from any device with an internet connection.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{mt: 6, textAlign: "center"}}>
                <Typography variant="h4" gutterBottom>
                    Pricing 
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Box 
                            sx={{
                                p: 3,
                                border: "1px solid",
                                borderColor: "grey.300",
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Basic
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                $5 / month
                            </Typography>
                            <Typography>
                                {''}
                                Access to basic flashcard features and limited storage.
                            </Typography>
                            <Button variant="contained" color="primary" sx={{mt: 2}}>
                                Choose Basic
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Box 
                        sx={{
                            p: 3,
                            border: "1px solid",
                            borderColor: "grey.300",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Pro
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            $10 / month
                        </Typography>
                        <Typography>
                            {''}
                            Unlimied flascards and storage with priority support.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{mt: 2}}>
                            Choose Pro
                            </Button>
                        </Box> 
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}