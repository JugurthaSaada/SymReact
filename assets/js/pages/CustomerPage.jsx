import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContentLoader from '../components/loaders/FormContentLoader';
import CustomersAPI from '../services/customersAPI';
import Field from "./../components/forms/Field";

const CustomerPage = ({match, history}) => {

    const {id="new"} = match.params;
    const [loading, setLoading] = useState(false);

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    //Récuperation du customer en fonction de l'id
    const fetchCustomers = async id => {
        try {
            const { firstName, lastName, email, company } = await CustomersAPI.find(id);
            setCustomer({firstName, lastName, email, company});
            setLoading(false);
        } catch (error) {
            toast.error("Attention, une erreur est survenue lors du chargement des clients.");
            history.replace("/customers");
        }
    }
    
    //Chargement du customer si besoin au chargement du composant ou au changement de l'id
    useEffect(() => {
        if(id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomers(id);
        }
    }, [id]);

    //Gestion des changement des input des formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setErrors({});
            
            if(editing){
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié.");
            }else{
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été créé.");
                history.replace("/customers");
            }
        } catch ({response}) {
            const { violations } = response.data;
            if(violations){
                const apiErrors={};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
                toast.error("Attention, une erreur est survenue.");
            }
        }
    };

    return ( <>
        {!editing && <h1>Création d'un client</h1> || <h1>Modification d'un client</h1>}
        {loading && <FormContentLoader/>}
        {!loading && <form onSubmit={handleSubmit}>
            <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client" error={errors.lastName} onChange={handleChange} value={customer.lastName}/>
            <Field name="firstName" label="Prénom" placeholder="Prénom du client" error={errors.firstName} onChange={handleChange} value={customer.firstName}/>
            <Field name="email" label="Email" placeholder="Adresse email du client" error={errors.email} onChange={handleChange} type="email" value={customer.email}/>
            <Field name="company" label="Entreprise" placeholder="Entreprise du client" error={errors.company} onChange={handleChange} value={customer.company}/>

            <div className="form-group">
                <button type="submit" className="btn btn-success">Valider</button>
                &nbsp;
                <Link to="/customers" className="btn btn-danger">Retour a la liste</Link>
            </div>
        </form>}
    </> );
}
 
export default CustomerPage;