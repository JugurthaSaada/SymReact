import moment from "moment";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination';
import InvoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES={
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS={
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = (props) => {
    
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState([]);
    const itemsPerPage = 5;

    //recup des invoice de l'api
    const fetchInvoices = async () => {
        try{
            const data = await InvoicesAPI.findAll()
            setInvoices(data);

        }catch(error){
            console.log(error.response);
        }
    }

    //charger les invoices de async
    useEffect(() => {
        fetchInvoices();
    }, []);

    //Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //Gestion de la suppression de la customer
    const handleDelete = async (id) => {
        const originalInvoices =[...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id))
        
        try{
            await InvoicesAPI.delete(id)
        }catch(error){
            setInvoices(originalInvoices);
        }
    };
    
    //Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    //Filtrage des customers en fonction de la recherche
    const filteredInvoices = invoices.filter(i=> 
        i.customer.lastName.toLowerCase().includes(search.toString().toLowerCase())
        || i.customer.firstName.toLowerCase().includes(search.toString().toLowerCase())
        || i.amount.toString().startsWith(search.toString().toLowerCase())
        || STATUS_LABELS[i.status].toLowerCase().includes(search.toString().toLowerCase())
    );

    //Pagination des données
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return ( 
    <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
            <Link className="btn btn-primary" to="/invoices/new">Créer une facture</Link>
        </div>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                    <td>{invoice.chrono}</td>
                    <td>
                        <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                    </td>
                    <td className="text-center">{formatDate(invoice.sentAt)}</td>
                    <td className="text-center">
                        <span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                    </td>
                    <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                    <td>
                        <Link to={"/invoices/"+invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>&nbsp;
                        <button className="btn btn-sm btn-danger" onClick={()=> handleDelete(invoice.id)}>Supprimer</button>
                    </td>
                </tr>)}
                
            </tbody>
        </table>

        <Pagination currentPage={currentPage} 
        itemsPerPage={itemsPerPage} 
        onPageChanged={handlePageChange} 
        length={filteredInvoices.length} />
    </> );
}
 
export default InvoicesPage;