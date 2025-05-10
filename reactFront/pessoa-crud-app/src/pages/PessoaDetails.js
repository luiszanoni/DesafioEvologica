// pages/PessoaDetails.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';
import {
    Container, CircularProgress, Typography, Card, CardContent,
    Grid, Button, Divider, CardActions, Snackbar, Paper
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {
    Person, Email, Phone, CalendarToday, Assignment, Edit as EditIcon, Delete as DeleteIcon
} from '@material-ui/icons';
import { getPessoaById, deletePessoa } from '../api/pessoaApi';
import { formatCPF, formatDate, formatPhone } from '../utils/formatters';
import { differenceInYears, parseISO } from 'date-fns';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(3),
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(3),
    },
    card: {
        marginBottom: theme.spacing(3),
    },
    infoItem: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2),
    },
    icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.primary.main,
    },
    label: {
        fontWeight: 'bold',
        marginRight: theme.spacing(1),
    },
    divider: {
        margin: theme.spacing(2, 0),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
    },
}));

const PessoaDetails = () => {
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

    // Delete mutation
    const deleteMutation = useMutation(deletePessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries('pessoas');
            history.push('/pessoas');
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `Erro ao excluir: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    });

    const handleDelete = () => {
        if (window.confirm(`Deseja realmente excluir "${pessoa.nome}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = () => {
        history.push(`/pessoas/${id}/edit`);
    };

    const handleBack = () => {
        history.push('/pessoas');
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        return differenceInYears(new Date(), parseISO(birthDate));
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
            <Typography variant="h4" className={classes.title}>
                Detalhes da Pessoa
            </Typography>

            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {pessoa.nome}
                    </Typography>

                    <Divider className={classes.divider} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={4}>
                            <Paper elevation={0} className={classes.infoItem}>
                                <Person className={classes.icon} />
                                <Typography variant="body1">
                                    <span className={classes.label}>Nome:</span> {pessoa.nome}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Paper elevation={0} className={classes.infoItem}>
                                <Assignment className={classes.icon} />
                                <Typography variant="body1">
                                    <span className={classes.label}>CPF:</span> {formatCPF(pessoa.cpf)}
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <Paper elevation={0} className={classes.infoItem}>
                                <CalendarToday className={classes.icon} />
                                <Typography variant="body1">
                                    <span className={classes.label}>Data de Nascimento:</span> {formatDate(pessoa.dataNascimento)}
                                    {pessoa.dataNascimento && (
                                        <span> ({calculateAge(pessoa.dataNascimento)} anos)</span>
                                    )}
                                </Typography>
                            </Paper>
                        </Grid>

                        {pessoa.email && (
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper elevation={0} className={classes.infoItem}>
                                    <Email className={classes.icon} />
                                    <Typography variant="body1">
                                        <span className={classes.label}>Email:</span> {pessoa.email}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}

                        {pessoa.telefone && (
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper elevation={0} className={classes.infoItem}>
                                    <Phone className={classes.icon} />
                                    <Typography variant="body1">
                                        <span className={classes.label}>Telefone:</span> {formatPhone(pessoa.telefone)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>

                <CardActions className={classes.buttons}>
                    <Button
                        variant="outlined"
                        color="default"
                        onClick={handleBack}
                    >
                        Voltar
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleEdit}
                        className={classes.button}
                    >
                        <EditIcon className={classes.buttonIcon} fontSize="small" />
                        Editar
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleDelete}
                        className={classes.button}
                        disabled={deleteMutation.isLoading}
                    >
                        <DeleteIcon className={classes.buttonIcon} fontSize="small" />
                        Excluir
                    </Button>
                </CardActions>
            </Card>

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

export default PessoaDetails;