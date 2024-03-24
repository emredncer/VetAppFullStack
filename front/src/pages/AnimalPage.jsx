import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export default function AnimalPage() {
    const [allAnimals, setAllAnimals] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [animalName, setAnimalName] = useState('');
    const [allCustomers, setAllCustomers] = useState([]);
    const [newAnimalData, setNewAnimalData] = useState({
        name: '',
        species: '',
        breed: '',
        gender: '',
        colour: '',
        dateOfBirth: '',
        customer: {}
    });
    const [updateAnimalId, setUpdateAnimalId] = useState(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);


    useEffect(() => {
        axios.get('https://vetappback.onrender.com/v1/animals')
            .then((res) => {
                setAllAnimals(res.data.data);
            })
            .catch(error => {
                console.error("Error fetching animals:", error);
                toast.error("Error fetching animals");
            });

        axios.get('https://vetappback.onrender.com/v1/customers')
            .then((res) => {
                setAllCustomers(res.data.data);
            })
            .catch(error => {
                console.error("Error fetching customers:", error);
                toast.error("Error fetching customers");
            });
    }, []);

    // Animalı customer ismine göre arama
    const filterAnimalsByCustomerName = async () => {
        try {
            const response = await axios.get(`https://vetappback.onrender.com/v1/animals/filterByCustomerName/${customerName}`);
            setAllAnimals(response.data.data);
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error fetching animals filtered by customer name:", error);
            toast.error("Error fetching animals filtered by customer name");
        }
    };

    // Animalı animal ismine göre arama
    const filterAnimalsByAnimalName = async () => {
        try {
            const response = await axios.get(`https://vetappback.onrender.com/v1/animals/filterByAnimalName/${animalName}`);
            setAllAnimals(response.data.data);
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error fetching animals filtered by animal name:", error);
            toast.error("Error fetching animals filtered by animal name");
        }
    };

    // Animal silme işlemi
    const handleDelete = async (id) => {
        try {
            let response = await axios.delete(`https://vetappback.onrender.com/v1/animals/${id}`);
            setAllAnimals(allAnimals.filter(animal => animal.id !== id));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error deleting animal:", error);
            toast.error("Error deleting animal");
        }
    };

    // Update işlemini handle eden arrow function
    const handleUpdate = (animal) => {
        setUpdateAnimalId(animal.id);
        setNewAnimalData({
            name: animal.name,
            species: animal.species,
            breed: animal.breed,
            gender: animal.gender,
            colour: animal.colour,
            dateOfBirth: animal.dateOfBirth,
            customer: animal.customer
        });
        setShowUpdateModal(true);
    };

    // Save modal işlemleri
    const handleShowSaveModal = () => {
        setShowSaveModal(true);
    };

    const handleCloseModals = () => {
        setShowSaveModal(false);
        setShowUpdateModal(false);
        setUpdateAnimalId(null);
        setNewAnimalData({
            name: '',
            species: '',
            breed: '',
            gender: '',
            colour: '',
            dateOfBirth: '',
            customer: {}
        });
    };

    // Save işlemini handle eden arrow function
    const handleSaveAnimal = async () => {
        try {
            if (updateAnimalId) {
                const result = await axios.put(`https://vetappback.onrender.com/v1/animals/${updateAnimalId}`, newAnimalData);
                const updatedAnimals = allAnimals.map(animal => {
                    if (animal.id === updateAnimalId) {
                        return {
                            ...animal,
                            ...newAnimalData
                        };
                    }
                    return animal;
                });
                setAllAnimals(updatedAnimals);
                toast.success(result.data.message);
                handleCloseModals();
            } else {
                const selectedCustomer = allCustomers.find(customer => customer.id === parseInt(newAnimalData.customer.id));
                const newDataWithCustomer = {
                    ...newAnimalData,
                    customer: selectedCustomer
                };
                

                const response = await axios.post('https://vetappback.onrender.com/v1/animals', newDataWithCustomer);
                setAllAnimals([...allAnimals, response.data.data]);
                toast.success(response.data.message);
                handleCloseModals();
            }
        } catch (error) {
            console.error("Error saving animal:", error);
            toast.error("Error saving animal");
        }
    };

    return (
        <div>
            <div className="m-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={filterAnimalsByCustomerName}>Filter</button>
                </div>
            </div>
            <div className="m-3">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Animal Name"
                        value={animalName}
                        onChange={(e) => setAnimalName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={filterAnimalsByAnimalName}>Filter</button>
                </div>
            </div>

            <div>
                <button className="btn btn-primary mb-3 ms-3 custom-btn-width" onClick={handleShowSaveModal}>Add Animal</button>
            </div>
            <table className="table table-primary table-hover">
                <thead>
                    <tr>
                        <th className="col">Name</th>
                        <th className="col">Species</th>
                        <th className="col">Breed</th>
                        <th className="col">Gender</th>
                        <th className="col">Birth Date</th>
                        <th className="col">Color</th>
                        <th className="col">Customer</th>
                        <th className="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allAnimals.map(animal => (
                        <tr key={animal.id}>
                            <td className="custom-cell-border">{animal.name}</td>
                            <td className="custom-cell-border">{animal.species}</td>
                            <td className="custom-cell-border">{animal.breed}</td>
                            <td className="custom-cell-border">{animal.gender}</td>
                            <td className="custom-cell-border">{animal.dateOfBirth}</td>
                            <td className="custom-cell-border"><div style={{ backgroundColor: animal.colour, fontWeight: 'bold', color: 'white' }}>
                                {animal.colour}
                            </div></td>
                            <td className="custom-cell-border">{animal.customer.name}</td>
                            <td className="custom-cell-border">
                                <button className="btn btn-warning" onClick={() => handleUpdate(animal)}>Update</button>
                                <button className="ms-2 btn btn-danger" onClick={() => handleDelete(animal.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showSaveModal &&
                <div className="custom-modal-wrapper">
                    <div className="custom-modal">
                        <div className="custom-modal-content">
                            <h5>Save Animal</h5>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalName">Name:</label>
                                        <input type="text" className="form-control" id="animalName" value={newAnimalData.name} onChange={(e) => setNewAnimalData({ ...newAnimalData, name: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalSpecies">Species:</label>
                                        <input type="text" className="form-control" id="animalSpecies" value={newAnimalData.species} onChange={(e) => setNewAnimalData({ ...newAnimalData, species: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalBreed">Breed:</label>
                                        <input type="text" className="form-control" id="animalBreed" value={newAnimalData.breed} onChange={(e) => setNewAnimalData({ ...newAnimalData, breed: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalGender">Gender:</label>
                                        <input type="text" className="form-control" id="animalGender" value={newAnimalData.gender} onChange={(e) => setNewAnimalData({ ...newAnimalData, gender: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalColour">Colour:</label>
                                        <input type="text" className="form-control" id="animalColour" value={newAnimalData.colour} onChange={(e) => setNewAnimalData({ ...newAnimalData, colour: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="animalDateOfBirth">Date of Birth:</label>
                                        <input type="date" className="form-control" id="animalDateOfBirth" value={newAnimalData.dateOfBirth} onChange={(e) => setNewAnimalData({ ...newAnimalData, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold" htmlFor="customerSelect">Customer:</label>
                                        <select className="form-control" id="customerSelect" onChange={(e) => setNewAnimalData({ ...newAnimalData, customer: { id: e.target.value } })}>
                                            <option value="">Select Customer</option>
                                            {allCustomers.map(custo => (
                                                <option key={custo.id} value={custo.id}>{custo.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="modal-buttons">
                                        <button className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseModals}>Cancel</button>
                                        <button className="btn btn-success custom-btn-width" type="submit" onClick={handleSaveAnimal}>Save</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>}
            {showUpdateModal && <div className="custom-modal-wrapper">
                <div className="custom-modal">

                    <div className="custom-modal-content">
                        <form>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalName">Name</label>
                                <input type="text" className="form-control" id="updateAnimalName" value={newAnimalData.name} onChange={(e) => setNewAnimalData({ ...newAnimalData, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalSpecies">Species</label>
                                <input type="text" className="form-control" id="updateAnimalSpecies" value={newAnimalData.species} onChange={(e) => setNewAnimalData({ ...newAnimalData, species: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalBreed">Breed</label>
                                <input type="text" className="form-control" id="updateAnimalBreed" value={newAnimalData.breed} onChange={(e) => setNewAnimalData({ ...newAnimalData, breed: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalGender">Gender</label>
                                <input type="text" className="form-control" id="updateAnimalGender" value={newAnimalData.gender} onChange={(e) => setNewAnimalData({ ...newAnimalData, gender: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalColour">Colour</label>
                                <input type="text" className="form-control" id="updateAnimalColour" value={newAnimalData.colour} onChange={(e) => setNewAnimalData({ ...newAnimalData, colour: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateAnimalDateOfBirth">Date of Birth</label>
                                <input type="text" className="form-control" id="updateAnimalDateOfBirth" value={newAnimalData.dateOfBirth} onChange={(e) => setNewAnimalData({ ...newAnimalData, dateOfBirth: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold" htmlFor="updateCustomerSelect">Customer</label>
                                <select className="form-control" id="updateCustomerSelect" value={newAnimalData.customer} onChange={(e) => setNewAnimalData({ ...newAnimalData, customer: { id: e.target.value } })}>
                                    <option value="">Select Customer</option>
                                    {allCustomers.map(custo => (
                                        <option key={custo.id} value={custo.id}>{custo.name}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" data-dismiss="modal" onClick={handleCloseModals}>Close</button>
                        <button type="button" className="btn btn-success custom-btn-width" onClick={handleSaveAnimal}>Save</button>
                    </div>
                </div>
            </div>}
        </div>
    );
}
