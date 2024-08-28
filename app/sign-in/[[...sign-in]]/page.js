import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
// import { SignIn } from '@clerk/nextjs';  // Assuming you're using Clerk for authentication
// import {ClerkProvider, SignedIn, SignedOut, SignInButton, SignIn, SignOutButton,UserButton } from '@clerk/nextjs'
import { SignIn, SignUp } from '@clerk/nextjs';
export default function SignUpPage() {
    return <Container maxWidth="sm">
        <AppBar position="static" sx={{backgroundColor: "#3f51b5"}}>
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{flexGrow: 1}}>
                        Flashcard SaaS
                </Typography>
                {/* <Button color="inherit">
                    <Link href="/sign-in" passHref>
                        Log In
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign Up
                    </Link>
                </Button> */}
            </Toolbar>
        </AppBar>
        

        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <SignIn />
        </Box>
    </Container>
}