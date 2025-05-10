// pages/PessoaEdit.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';
import { Container, CircularProgress, Typography, Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { getPessoaById, updatePessoa } from '../api/pessoaApi';
import PessoaForm from '../components/PessoaForm';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(3),
    },
}));

const PessoaEdit = () => {
    const classes = useStyles();
    const { id } = useParams();
    const history = useHistory();
    const queryClient = useQueryClient();
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch pessoa by ID
    const { data: pessoa, isLoading, error } = useQuery(
        ['pessoa', id],
        () => getPessoaById(id),
        {
            refetchOnWindowFocus: false,
            retry: 1,
        }
    );

    // Update mutation
    const updateMutation = useMutation(updatePessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries(['pessoa', id]);
            queryClient.invalidateQueries('pessoas');
            history.push(`/pessoas/${id}`);
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `Erro ao atualizar: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    });

    const handleSubmit = (data) => {
        updateMutation.mutate({ id, ...data });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    if (isLoading) {
        return (
            <Container className={classes.root}>
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className={classes.root}>
                <Alert severity="error">
                    Erro ao carregar dados: {error.message}
                </Alert>
            </Container>
        );
    }

    if (!pessoa) {
        return (
            <Container className={classes.root}>
                <Typography variant="h6" color="error">
                    Pessoa não encontrada
                </Typography>
            </Container>
        );
    }

    return (
        <Container className={classes.root}>
            <PessoaForm
                title={`Editar: ${pessoa.nome}`}
                initialData={pessoa}
                onSubmit={handleSubmit}
                isSubmitting={updateMutation.isLoading}
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

export default PessoaEdit;