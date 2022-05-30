import React, { useContext, useState } from 'react';
import Field from '../components/forms/Field';
import AuthContext from '../contexts/AuthContext';
import AuthAPI from '../services/authAPI';

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    //Gestion des chaps
    const handleChange = ({currentTarget}) => {
        setCredentials({...credentials, [currentTarget.name]: currentTarget.value});
    };

    //Gestion du submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");
        }catch(error){
            setError("L'adresse email ou le mot de passe est incorrect. Veuillez essayer à nouveau.");
        }
    };

    return ( 
        <>
            <h1>Espace client</h1>
            &nbsp;
            <form onSubmit={handleSubmit}>
            <Field label="Adresse email" 
                    name="username" 
                    value={credentials.username} 
                    onChange={handleChange} 
                    placeholder="Adresse email de connexion" 
                    error={error} 
                />

            <Field label="Mot de passe" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    type="password"
                    error={error} 
                />
                <div className="form-group"><button type="submit" className="btn btn-success">Connexion</button></div>
            </form>
        </> 
    );
}
 
export default LoginPage;