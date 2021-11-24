import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './components';
import { AppContextProvider } from './contexts/AppContext';
import { HomeScreen } from './screens';
function App() {
  return (
    <div className='h-screen'>
      <AppContextProvider>
        <Header />
        <Router>
          <Switch>
            <Route path='/' component={HomeScreen} />
          </Switch>
        </Router>
      </AppContextProvider>
    </div>
  );
}

export default App;
