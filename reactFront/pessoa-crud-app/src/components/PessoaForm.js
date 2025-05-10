// components/PessoaForm.js
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField, Button, Grid, Card, CardContent,
    CardActions, Typography, InputAdornment, CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { ptBR } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { Person, Email, Phone, CalendarToday, Assignment } from '@material-ui/icons';
import InputMask from 'react-input-mask';
import { validateCPF, validateEmail } from '../utils/Validators';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    title: {
        marginBottom: theme.spacing(2),
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    wrapper: {
        position: 'relative',
    },
}));

const PessoaForm = ({
    initialData,
    onSubmit,
    isSubmitting,
    title
}) => {
    const classes = useStyles();

    const defaultValues = {
        nome: initialData?.nome || '',
        cpf: initialData?.cpf || '',
        email: initialData?.email || '',
        telefone: initialData?.telefone || '',
        dataNascimento: initialData?.dataNascimento
            ? parseISO(initialData.dataNascimento)
            : null,
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm({ defaultValues });

    // For CPF validation feedback as user types
    const cpfValue = watch('cpf');
    const isValidCPF = cpfValue?.replace(/\D/g, '').length === 11 && validateCPF(cpfValue);

    const onFormSubmit = (data) => {
        // Format date to ISO string (YYYY-MM-DD)
        const formattedData = {
            ...data,
            cpf: data.cpf.replace(/\D/g, ''),
            telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
            dataNascimento: data.dataNascimento ? data.dataNascimento.toISOString().split('T')[0] : null,
        };

        onSubmit(formattedData);
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" className={classes.title}>
                    {title}
                </Typography>

                <form className={classes.form} onSubmit={handleSubmit(onFormSubmit)} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="nome"
                                control={control}
                                rules={{
                                    required: 'O nome é obrigatório',
                                    pattern: {
                                        value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
                                        message: 'O nome deve conter apenas caracteres alfabéticos',
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.nome}
                                        helperText={errors.nome?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="cpf"
                                control={control}
                                rules={{
                                    required: 'O CPF é obrigatório',
                                    validate: value => validateCPF(value) || 'CPF inválido'
                                }}
                                render={({ field }) => (
                                    <InputMask
                                        mask="999.999.999-99"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    >
                                        {(inputProps) => (
                                            <TextField
                                                {...inputProps}
                                                label="CPF"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors.cpf}
                                                helperText={errors.cpf?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Assignment />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR}>
                                <Controller
                                    name="dataNascimento"
                                    control={control}
                                    rules={{ required: 'A data de nascimento é obrigatória' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            disableFuture
                                            autoOk
                                            label="Data de Nascimento"
                                            format="dd/MM/yyyy"
                                            inputVariant="outlined"
                                            fullWidth
                                            error={!!errors.dataNascimento}
                                            helperText={errors.dataNascimento?.message}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <CalendarToday />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/,
                                        message: 'Digite um endereço de E-mail válido',
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="telefone"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^[\d() -]+$/,
                                        message: 'Digite apenas números',
                                    }
                                }}
                                render={({ field }) => (
                                    <InputMask
                                        mask={field.value?.length > 10 ? "(99) 9 9999-9999" : "(99) 9999-9999"}
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                    >
                                        {(inputProps) => (
                                            <TextField
                                                {...inputProps}
                                                label="Telefone"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors.telefone}
                                                helperText={errors.telefone?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    </InputMask>
                                )}
                            />
                        </Grid>
                    </Grid>
                </form>
            </CardContent>

            <CardActions className={classes.buttons}>
                <Button
                    component="a"
                    href="/pessoas"
                    color="default"
                    disabled={isSubmitting}
                >
                    Cancelar
                </Button>
                <div className={classes.wrapper}>
                    <Button
                        onClick={handleSubmit(onFormSubmit)}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={isSubmitting}
                    >
                        Salvar
                    </Button>
                    {isSubmitting && (
                        <CircularProgress size={24} className={classes.buttonProgress} />
                    )}
                </div>
            </CardActions>
        </Card>
    );
};

export default PessoaForm;