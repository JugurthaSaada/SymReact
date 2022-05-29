/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
// start the Stimulus application
import './bootstrap';
import Navbar from './js/components/Navbar';
import PrivateRoute from './js/components/PrivateRoute';
import AuthContext from './js/contexts/AuthContext';
import CustomersPage from './js/pages/CustomersPage';
import HomePage from './js/pages/HomePage';
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage';
import AuthAPI from "./js/services/authAPI";
// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';




AuthAPI.setup();
 
export default PrivateRoute;


const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());
    const NavbarWithRouter = withRouter(Navbar);

    return (
    <AuthContext.Provider value={{
        isAuthenticated,
        setIsAuthenticated
    }}>
        <HashRouter>
            <NavbarWithRouter />

            <main className="container pt-5">
                <Switch>
                    <Route path="/login" component={LoginPage}/>
                    <PrivateRoute path="/invoices" component={InvoicesPage}/>
                    <PrivateRoute path="/customers" component={CustomersPage}/>
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    </AuthContext.Provider>);
}

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);