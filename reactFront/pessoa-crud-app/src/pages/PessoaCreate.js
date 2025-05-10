// pages/PessoaCreate.js
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { Container, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { createPessoa } from '../api/pessoaApi';
import PessoaForm from '../components/PessoaForm';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
}));

const PessoaCreate = () => {
    const classes = useStyles();
    const history = useHistory();
    const queryClient = useQueryClient();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const createMutation = useMutation(createPessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries('pessoas');
            history.push('/pessoas');
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `Erro ao salvar: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    });

    const handleSubmit = (data) => {
        createMutation.mutate(data);
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <Container className={classes.root}>
            <PessoaForm
                title="Nova Pessoa"
                onSubmit={handleSubmit}
                isSubmitting={createMutation.isLoading}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PessoaCreate;