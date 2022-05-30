import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState([]);

    //permet de recup les customers en async
    const fetchCustomers = async() => {
        try{
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        }catch(error){
            console.log(error.response);
        }
    }

    //au chargement on recup les customers async
    useEffect(() => {fetchCustomers()}, []);

    //Gestion de la suppression de la customer
    const handleDelete = async (id) => {
        const originalCustomers =[...customers];

        setCustomers(customers.filter(customer => customer.id !== id))
        
        try{
            await CustomersAPI.delete(id)
        }catch(error){
            setCustomers(originalCustomers);
        }
    };

    //Gestion du changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 5;

    //Filtrage des customers en fonction de la recherche
    const filteredCustomer = customers.filter(
        c => c.firstName.toLowerCase().includes(search.toString().toLowerCase()) 
        || c.lastName.toLowerCase().includes(search.toString().toLowerCase())
        || c.email.toLowerCase().includes(search.toString().toLowerCase())
        || (c.company && c.company.toLowerCase().includes(search.toString().toLowerCase()))
    );

    //Pagination des données
    const paginatedCustomers = Pagination.getData(filteredCustomer, currentPage, itemsPerPage);

    return ( 
    <>

        <div className="mb-3 d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">Créer un nouveau client</Link>
        </div>
        

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..." />
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                {paginatedCustomers.map(customer => <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                        <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}</td>
                    <td className="text-center">{customer.invoices.length}</td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                    <td>
                        <button 
                        onClick={()=> handleDelete(customer.id)}
                        disabled={customer.invoices.length > 0} 
                        className="btn btn-sm btn-danger">Supprimer</button>
                    </td>
                </tr>)}
                
            </tbody>
        </table>

        {itemsPerPage < filteredCustomer.length && <Pagination
            currentPage={currentPage} 
            itemsPerPage={itemsPerPage} 
            length={filteredCustomer.length} 
            onPageChanged={handlePageChange}
        />}
    </> );
}
 
export default CustomersPage; 