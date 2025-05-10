// App.js - Main application component
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { blue } from '@material-ui/core/colors';

// Components
import Header from './components/Header';
import PessoaList from './pages/PessoaList';
import PessoaCreate from './pages/PessoaCreate';
import PessoaEdit from './pages/PessoaEdit';
import PessoaDetails from './pages/PessoaDetails';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Create Material-UI theme
const theme = createMuiTheme({
  palette: {
    primary: blue,
    type: 'light',
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={() => <Redirect to="/pessoas" />} />
            <Route exact path="/pessoas" component={PessoaList} />
            <Route exact path="/pessoas/new" component={PessoaCreate} />
            <Route exact path="/pessoas/:id" component={PessoaDetails} />
            <Route exact path="/pessoas/:id/edit" component={PessoaEdit} />
          </Switch>
        </Router>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
