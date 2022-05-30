import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Select from '../components/forms/Select';
import CustomersAPI from '../services/customersAPI';
import InvoicesAPI from '../services/invoicesAPI';
import Field from "./../components/forms/Field";

const InvoicePage = ({match, history}) => {

    const {id="new"} = match.params;

    const [customers, setCustomers] = useState([]);

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    });

    const [editing, setEditing] = useState(false);

    //recup des clients
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            
            if(!invoice.customer && id ==="new") setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            //TODO: notification flash d'une erreur
            history.replace("/invoices");
        }
    }
    
    // recup d"une facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch (error) {
            //TODO: notification flash d'une erreur
            history.replace("/invoices");
        }
    }
    
    //recup de la liste des clients a chaque chargement du composent
    useEffect(() => {
        fetchCustomers();
    }, []);

    //Recup de la bonne facture quand l'id de l'url change
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);

    //Gestion des changement des input des formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    //Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setErrors({});
            if(editing){
                await InvoicesAPI.update(id, invoice);
                //TODO: flash notif de success
                history.replace("/invoices");
            }else{
                await InvoicesAPI.create(invoice);
                //TODO: flash notif de success
                history.replace("/invoices");
            }
        } catch ({response}) {
            const { violations } = response.data;
            if(violations){
                const apiErrors={};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });

                setErrors(apiErrors);
                //TODO: flash notif de error
            }
        }
    };

    return ( <>
        {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}

        <form onSubmit={handleSubmit}>
            <Field name="amount" type="number" label="Montant" placeholder="Montant de la facture" error={errors.amount} onChange={handleChange} value={invoice.amount}/>

            <Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange} >
                {customers.map(customer => 
                <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}
                </option>
                )}
            </Select>

            &nbsp;
            <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange} >
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>

            &nbsp;
            <div className="form-group">
                <button type="submit" className="btn btn-success">Valider</button>
                &nbsp;
                <Link to="/invoices" className="btn btn-danger">Retour a la liste</Link>
            </div>
        </form>
    </> );
}
 
export default InvoicePage;