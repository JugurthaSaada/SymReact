import React, { useContext, useState } from 'react';
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
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input value={credentials.username} 
                        onChange={handleChange} 
                        type="email" 
                        placeholder="Adresse email de connexion" 
                        name="username" id="username" 
                        className={"form-control"+ (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                &nbsp;
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input value={credentials.password} onChange={handleChange} type="password" placeholder="Mot de passe" name="password" id="password" className={"form-control"+ (error && " is-invalid")} />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                &nbsp;
                <div className="form-group"><button type="submit" className="btn btn-success">Connexion</button></div>
            </form>
        </> 
    );
}
 
export default LoginPage;