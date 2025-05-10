// pages/PessoaList.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
    Container, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton,
    TablePagination, TextField, InputAdornment, Tooltip,
    CircularProgress, Snackbar
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { getPessoas, deletePessoa } from '../api/pessoaApi';
import { formatCPF, formatDate } from '../utils/formatters';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(3),
    },
    search: {
        marginBottom: theme.spacing(3),
    },
    tableContainer: {
        marginBottom: theme.spacing(2),
    },
    emptyMessage: {
        padding: theme.spacing(3),
        textAlign: 'center',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        padding: theme.spacing(3),
    },
}));

const PessoaList = () => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Fetch pessoas with React Query
    const { data, isLoading, error } = useQuery('pessoas', getPessoas);

    // Delete mutation
    const deleteMutation = useMutation(deletePessoa, {
        onSuccess: () => {
            queryClient.invalidateQueries('pessoas');
            setSnackbar({ open: true, message: 'Pessoa excluída com sucesso!', severity: 'success' });
        },
        onError: (error) => {
            setSnackbar({
                open: true,
                message: `Erro ao excluir: ${error.response?.data?.message || error.message}`,
                severity: 'error'
            });
        }
    });

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleConfirmDelete = (id, nome) => {
        if (window.confirm(`Deseja realmente excluir a pessoa "${nome}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    // Extract pessoas array safely with nullish coalescing
    const pessoas = data?.content || [];

    // Filter pessoas based on search term
    const filteredPessoas = pessoas.filter(pessoa =>
        pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pessoa.cpf.includes(searchTerm) ||
        (pessoa.email && pessoa.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Paginate
    const paginatedPessoas = filteredPessoas.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    if (error) {
        return (
            <Container className={classes.root}>
                <Alert severity="error">
                    Erro ao carregar dados: {error.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container className={classes.root}>
            <Typography variant="h4" className={classes.title}>
                Lista de Pessoas
            </Typography>

            <TextField
                className={classes.search}
                variant="outlined"
                fullWidth
                placeholder="Buscar por nome, CPF ou email..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />

            {isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress />
                </div>
            ) : (
                <>
                    <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Data de Nascimento</TableCell>
                                    <TableCell align="center">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPessoas.length > 0 ? (
                                    paginatedPessoas.map((pessoa) => (
                                        <TableRow key={pessoa.id}>
                                            <TableCell>{pessoa.nome}</TableCell>
                                            <TableCell>{formatCPF(pessoa.cpf)}</TableCell>
                                            <TableCell>{pessoa.email || '-'}</TableCell>
                                            <TableCell>{formatDate(pessoa.dataNascimento)}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Visualizar">
                                                    <IconButton
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={`/pessoas/${pessoa.id}`}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={`/pessoas/${pessoa.id}/edit`}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Excluir">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleConfirmDelete(pessoa.id, pessoa.nome)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className={classes.emptyMessage}>
                                            {searchTerm
                                                ? "Nenhuma pessoa encontrada com os critérios de busca"
                                                : "Nenhuma pessoa cadastrada"}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredPessoas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Itens por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </>
            )}

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

export default PessoaList;