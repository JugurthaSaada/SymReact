import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from '../components/forms/Select';
import FormContentLoader from '../components/loaders/FormContentLoader';
import CustomersAPI from '../services/customersAPI';
import InvoicesAPI from '../services/invoicesAPI';
import Field from "./../components/forms/Field";

const InvoicePage = ({match, history}) => {

    const {id="new"} = match.params;

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
            if(!invoice.customer && id ==="new") setInvoice({...invoice, customer: data[0].id});
        } catch (error) {
            toast.error("Attention, une erreur est survenue lors du chargement des clients.");
            history.replace("/invoices");
        }
    }
    
    // recup d"une facture
    const fetchInvoice = async id => {
        try {
            const {amount, status, customer} = await InvoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
            setLoading(false);
        } catch (error) {
            toast.error("Attention, une erreur est survenue lors du chargement des factures.");
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
                toast.success("La facture a bien été modifiée.");
                history.replace("/invoices");
            }else{
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistrée.");
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
                toast.error("Attention, une erreur est survenue.");
            }
        }
    };

    return ( <>
        {!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
        {loading && <FormContentLoader/>}

        {!loading && <form onSubmit={handleSubmit}>
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
        </form> }
    </> );
}
 
export default InvoicePage;