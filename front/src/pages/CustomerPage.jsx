import React, { useEffect, useState } from "react";
import axios from "axios";
import AddCustomerModal from '../components/AddCustomerModal'

export default function CustomerPage() {
    const [allCustomers, setAllCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customer, setCustomer] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCustomerId, setDeleteCustomerId] = useState(null);
    const [updateCustomerData, setUpdateCustomerData] = useState({
        name: "",
        phone: "",
        mail: "",
        address: "",
        city: ""
    });

    useEffect(() => {
        axios.get('http://localhost:8080/v1/customers').then((res) => {
            setAllCustomers(res.data.data);
        });
    }, []);

    const handleDelete = async (customerId) => {
        try {
            await axios.delete(`http://localhost:8080/v1/customers/${customerId}`);
            setAllCustomers(allCustomers.filter(customer => customer.id !== customerId));
        } catch (error) {
            console.error("Error deleting customer:", error);
        }
    };

    const handleUpdate = (customer) => {
        setCustomer(customer);
        setShowModal(true);
        setUpdateCustomerData({
            name: customer.name,
            phone: customer.phone,
            mail: customer.mail,
            address: customer.address,
            city: customer.city
        });
    };

    const handleUpdateCustomerDataChange = (event) => {
        const { name, value } = event.target;
        setUpdateCustomerData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmitUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/v1/customers/${customer.id}`, updateCustomerData);
            const updatedCustomers = allCustomers.map(cust => {
                if (cust.id === customer.id) {
                    return { ...cust, ...updateCustomerData };
                }
                return cust;
            });
            setAllCustomers(updatedCustomers);
            setShowModal(false);
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const foundCustomer = allCustomers.find(customer => customer.id === parseInt(searchTerm));
        setCustomer(foundCustomer);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        if (event.target.value === '') {
            setCustomer(null);
            axios.get('http://localhost:8080/v1/customers').then((res) => {
                setAllCustomers(res.data.data);
            });
        }
    };

    const handleFilterCustomers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/v1/customers/filterByCustomerName/${searchTerm}`);
            setAllCustomers(response.data.data);
        } catch (error) {
            console.error("Error filtering customers by name:", error);
        }
    };

    const handleAddCustomer = () => {
        setCustomer(null);
        setShowCreateModal(true);
        setUpdateCustomerData({
            name: "",
            phone: "",
            mail: "",
            address: "",
            city: ""
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    const handleOpenDeleteModal = (customerId) => {
        setDeleteCustomerId(customerId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        handleDelete(deleteCustomerId);
        setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="page-container">
            <div className="table-container">
                <button className="btn btn-primary m-3 custom-btn-width" onClick={handleAddCustomer}>Add Customer</button>
                {showCreateModal && <AddCustomerModal handleClose={handleCloseCreateModal} />}
                {showModal && (
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <h5>Update Customer</h5>
                                <form onSubmit={handleSubmitUpdate}>
                                    <div className="form-group">
                                        <label className="fw-bold">Name:</label>
                                        <input className="form-control" type="text" name="name" value={updateCustomerData.name} onChange={handleUpdateCustomerDataChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold">Phone:</label>
                                        <input className="form-control" type="text" name="phone" value={updateCustomerData.phone} onChange={handleUpdateCustomerDataChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold">Mail:</label>
                                        <input className="form-control" type="text" name="mail" value={updateCustomerData.mail} onChange={handleUpdateCustomerDataChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold">Address:</label>
                                        <input className="form-control" type="text" name="address" value={updateCustomerData.address} onChange={handleUpdateCustomerDataChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold">City:</label>
                                        <input className="form-control" type="text" name="city" value={updateCustomerData.city} onChange={handleUpdateCustomerDataChange} />
                                    </div>
                                    <div className="modal-buttons">
                                        <button className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseModal}>Cancel</button>
                                        <button className="btn btn-success custom-btn-width" type="submit">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="m-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search By Id..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>

                
                <div>
                    <button className="btn btn-primary m-3 custom-btn-width" onClick={handleFilterCustomers}>Filter Customers by Name</button>
                </div>

                <table className="table table-primary table-hover">
                    <thead>
                        <tr>
                            <th className="col">Name</th>
                            <th className="col">Phone</th>
                            <th className="col">Mail</th>
                            <th className="col">City</th>
                            <th className="col">Address</th>
                            <th className="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer ? (
                            <tr key={customer.id}>
                                <td className="custom-cell-border">{customer.name}</td>
                                <td className="custom-cell-border">{customer.phone}</td>
                                <td className="custom-cell-border">{customer.mail}</td>
                                <td className="custom-cell-border">{customer.city}</td>
                                <td className="custom-cell-border">{customer.address}</td>
                                <td className="custom-cell-border">
                                    <button className="btn btn-warning" onClick={() => handleUpdate(customer)}>Update</button>
                                    <button className="ms-2 btn btn-danger" onClick={() => handleOpenDeleteModal(customer.id)}>Delete</button>
                                </td>
                            </tr>
                        ) : (
                            allCustomers.length > 0 ? (
                                allCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td className="custom-cell-border">{customer.name}</td>
                                        <td className="custom-cell-border">{customer.phone}</td>
                                        <td className="custom-cell-border">{customer.mail}</td>
                                        <td className="custom-cell-border">{customer.city}</td>
                                        <td className="custom-cell-border">{customer.address}</td>
                                        <td className="custom-cell-border">
                                            <button className="btn btn-warning" onClick={() => handleUpdate(customer)}>Update</button>
                                            <button className="ms-2 btn btn-danger" onClick={() => handleOpenDeleteModal(customer.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">Data Not Found</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
            
            {showDeleteModal && (
                <div className="custom-modal-wrapper">
                    <div className="custom-modal">
                    <div className="custom-modal-content">
                        <h2>Are you sure you want to delete this customer?</h2>
                        <div className="custom-modal-buttons">
                            <button className="mb-2 btn btn-danger custom-btn-width" onClick={handleConfirmDelete}>Yes</button>
                            <button className="mb-2 btn btn-secondary custom-btn-width" onClick={handleCancelDelete}>No</button>
                        </div>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}
