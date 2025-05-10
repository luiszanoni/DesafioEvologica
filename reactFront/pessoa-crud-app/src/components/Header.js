// components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    link: {
        color: 'white',
        textDecoration: 'none',
    },
}));

const Header = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <RouterLink to="/pessoas" className={classes.link}>
                            Sistema de Gerenciamento de Pessoas
                        </RouterLink>
                    </Typography>
                    <Button
                        color="inherit"
                        component={RouterLink}
                        to="/pessoas/new"
                    >
                        Nova Pessoa
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
