'use client';
import React, { ChangeEvent, ChangeEventHandler, useState } from 'react';

import { Button, Link, TextField, SelectChangeEvent, useTheme, Typography } from '@mui/material';
import router, { useRouter } from 'next/router';
import { StripeAppProps } from '@/types';

export default function LoginPage(props: StripeAppProps) {

    const router = useRouter();
    const theme = useTheme();
    const [loginCred, setLoginCred] = useState<{username: string, password: string}>({
        username: '',
        password: '',
    });

    //   const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleLoginCredPasswordChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const passwordString = target.value;

        setLoginCred(prev => ({
            ...prev,
            password: passwordString,
        }));
    };

    const handleLoginCredUsernameChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        const usernameString = target.value;
        setLoginCred(prev => ({
            ...prev,
            username: usernameString,
        }));
    };

    const handleSubmit = async () => {
        console.log('Log in button pressed.');
        const allValuesFilled = Object.values(loginCred).every(value => value !== '');
        if (!allValuesFilled) {
            console.log("Not all fields are filled.")
        }
        
        const response = await fetch('api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginCred)
        })

        if (!response.ok) {
            console.log("Something went wrong.")
        }

        const data = await response.json();
        console.log("Login successful");
        router.push('/admin')
        
    };

    return (
        <div id="content" className='flex center middle' >
            <div className='column' style={{ width: "20rem", paddingTop: "20vh" }}>
                <Typography variant="h2">Login</Typography>
                <div className='column snug' style={{ alignItems: 'flex-start', gap: '1rem' }}>
                    <TextField
                        key="username"
                        type="username"
                        label="Username"
                        variant="outlined"
                        value={loginCred.username}
                        onChange={handleLoginCredUsernameChange}
                        sx={{ width: '100%' }}
                    />
                    <TextField
                        key="password"
                        type="password"
                        label="Password"
                        variant="outlined"
                        value={loginCred.password}
                        onChange={handleLoginCredPasswordChange}
                        sx={{ width: '100%' }}
                    />
                   <div className="flex center middle">
                   <Button fullWidth variant="contained" onClick={handleSubmit}>
                        Login
                    </Button>
                    <Link href="/register">Register</Link>
                   </div>
                </div>
            </div>
        </div>
    );
}
