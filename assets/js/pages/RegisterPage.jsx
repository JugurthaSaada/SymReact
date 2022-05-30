import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import UsersAPI from '../services/usersAPI';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email:"",
        password:"",
        passwordConfirm:""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email:"",
        password:"",
        passwordConfirm:""
    });

    //Gestion des changement des input des formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setUser({...user, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors={};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Vos mot de passe ne sont pas identique";
            setErrors(apiErrors);
            return;
        }

        try {
            await UsersAPI.register(user);
            setErrors({});
            history.replace('/login');
             //TODO: flash notif de success
        } catch ({response}) {
            const { violations } = response.data;
            if(violations){
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
                //TODO: flash notif de error
            }
        }
        console.log(user);
    };

    return ( 
    <>
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
        <Field 
                name="firstName" 
                label="Prénom" 
                placeholder="Prénom" 
                error={errors.firstName} 
                value={user.firstName} 
                onChange={handleChange}
            />
            <Field 
                name="lastName" 
                label="Nom de famille" 
                placeholder="Nom de famille" 
                error={errors.lastName} 
                value={user.lastName} 
                onChange={handleChange}
            />
            <Field 
                name="email" 
                label="Adresse email" 
                placeholder="Adresse email" 
                type="email"
                error={errors.email} 
                value={user.email} 
                onChange={handleChange}
            />
            <Field 
                name="password" 
                label="Mot de passe" 
                placeholder="Mot de passe" 
                type="password"
                error={errors.password} 
                value={user.password} 
                onChange={handleChange}
            />
            <Field 
                name="passwordConfirm" 
                label="Confirmation de mot de passe" 
                placeholder="Confirmez votre mot de passe" 
                type="password"
                error={errors.passwordConfirm} 
                value={user.passwordConfirm} 
                onChange={handleChange}
            />

            <div className="form-group">
                <button type="submit" className="btn btn-success">Inscription</button>
                &nbsp;
                <Link to="/login" className="btn btn-info">Se connecter</Link>
            </div>
        </form>
    </> 
    );
}
 
export default RegisterPage;