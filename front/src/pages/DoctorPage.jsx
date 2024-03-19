import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorPage() {
    const [allDoctors, setAllDoctors] = useState([]);
    const [allAvailableDates, setAllAvailableDates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchDateTerm, setSearchDateTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showAddDateModal, setShowAddDateModal] = useState(false);
    const [showUpdateDateModal, setShowUpdateDateModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newDoctorData, setNewDoctorData] = useState({
        name: "",
        phone: "",
        mail: "",
        address: "",
        city: ""
    });
    const [newDateData, setNewDateData] = useState({
        availableDate: "",
        doctor: {}
    });

    useEffect(() => {
        axios.get('http://localhost:8080/v1/doctors').then((res) => {
            setAllDoctors(res.data.data);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/v1/availableDates').then((res) => {
            setAllAvailableDates(res.data.data);
        });
    }, []);

    const handleDeleteDoctor = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/v1/doctors/${id}`);
            setAllDoctors(allDoctors.filter(doctor => doctor.id !== id));
        } catch (error) {
            console.error("Error deleting doctor:", error);
        }
    };

    const handleUpdateDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setShowUpdateModal(true);
        setNewDoctorData({
            name: doctor.name,
            phone: doctor.phone,
            mail: doctor.mail,
            address: doctor.address,
            city: doctor.city
        });
    };

    const handleAddModalOpen = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleUpdateModalClose = () => {
        setShowUpdateModal(false);
    };

    const handleDoctorInputChange = (event) => {
        const { name, value } = event.target;
        setNewDoctorData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddDoctor = async () => {
        try {
            const response = await axios.post('http://localhost:8080/v1/doctors', newDoctorData);
            setAllDoctors([...allDoctors, response.data.data]);
            setShowAddModal(false);
            setNewDoctorData({
                name: "",
                phone: "",
                mail: "",
                address: "",
                city: ""
            });
        } catch (error) {
            console.error("Error adding new doctor:", error);
        }
    };

    const handleUpdateDoctorData = async () => {
        try {
            await axios.put(`http://localhost:8080/v1/doctors/${selectedDoctor.id}`, newDoctorData);
            const updatedDoctors = allDoctors.map(doctor => {
                if (doctor.id === selectedDoctor.id) {
                    return { ...doctor, ...newDoctorData };
                }
                return doctor;
            });
            setAllDoctors(updatedDoctors);
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating doctor:", error);
        }
    };

    const handleAddDateModalOpen = () => {
        setShowAddDateModal(true);
    };

    const handleAddDateModalClose = () => {
        setShowAddDateModal(false);
    };

    const handleUpdateDateModalClose = () => {
        setShowUpdateDateModal(false);
    };

    const handleDateInputChange = (event) => {
        const { name, value } = event.target;
        setNewDateData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddDate = async () => {
        try {
            const selectedDoctor = await axios.get(`http://localhost:8080/v1/doctors/${newDateData.doctor}`).then((res) => { return res.data.data })
            const response = axios.post('http://localhost:8080/v1/availableDates', {
                availableDate: newDateData.availableDate,
                doctor: selectedDoctor
            });

            setAllAvailableDates([...allAvailableDates, response.data.data]);
            setShowAddDateModal(false);
            setNewDateData({
                availableDate: "",
                doctor: ""
            });
        } catch (error) {
            console.error("Error adding new date:", error);
        }

    };

    const handleUpdateDate = (date) => {
        setSelectedDate(date);
        setShowUpdateDateModal(true);
        setNewDateData({
            availableDate: date.availableDate,
            doctor: date.doctor
        });
    };

    const handleUpdateDateData = async () => {
        try {
            await axios.put(`http://localhost:8080/v1/availableDates/${selectedDate.id}`, newDateData);
            const updatedDates = allAvailableDates.map(date => {
                if (date.id === selectedDate.id) {
                    return { ...date, ...newDateData };
                }
                return date;
            });
            setAllAvailableDates(updatedDates);
            setShowUpdateDateModal(false);
        } catch (error) {
            console.error("Error updating date:", error);
        }
    };

    const handleDeleteDate = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/v1/availableDates/${id}`);
            setAllAvailableDates(allAvailableDates.filter(date => date.id !== id));
        } catch (error) {
            console.error("Error deleting date:", error);
        }
    };

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (!value) {
            axios.get('http://localhost:8080/v1/doctors').then((res) => {
                setAllDoctors(res.data.data);
            });
        }
    };

    const handleSearchDateChange = (event) => {
        const value = event.target.value;
        setSearchDateTerm(value);
        if (!value) {
            axios.get('http://localhost:8080/v1/availableDates').then((res) => {
                setAllAvailableDates(res.data.data);
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (searchTerm) {
                const response = await axios.get(`http://localhost:8080/v1/doctors/${searchTerm}`);
                setAllDoctors([response.data.data]);
            }
        } catch (error) {
            console.error("Error fetching doctors filtered by name:", error);
        }
    };

    const handleDateSubmit = async (event) => {
        event.preventDefault();
        try {
            if (searchDateTerm) {
                const response = await axios.get(`http://localhost:8080/v1/availableDates/${searchDateTerm}`);
                setAllAvailableDates([response.data.data]);
            }
        } catch (error) {
            console.error("Error fetching available dates filtered by id:", error);
        }
    };

    return (
        <div className="page-container">
            <div className="table-container">
                <button className="btn btn-primary m-3 custom-btn-width" onClick={handleAddModalOpen}>Add Doctor</button>
                {showAddModal && (
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <h5>Add Doctor</h5>
                                <div className="modal-body">
                                    <form onSubmit={handleAddDoctor}>
                                        <div className="form-group">
                                            <label className="fw-bold">Name:</label>
                                            <input className="form-control" type="text" name="name" value={newDoctorData.name} onChange={handleDoctorInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">Phone:</label>
                                            <input className="form-control" type="text" name="phone" value={newDoctorData.phone} onChange={handleDoctorInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">Mail:</label>
                                            <input className="form-control" type="text" name="mail" value={newDoctorData.mail} onChange={handleDoctorInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">Address:</label>
                                            <input className="form-control" type="text" name="address" value={newDoctorData.address} onChange={handleDoctorInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">City:</label>
                                            <input className="form-control" type="text" name="city" value={newDoctorData.city} onChange={handleDoctorInputChange} />
                                        </div>
                                        <div className="modal-buttons">
                                            <button className="mb-2 btn btn-secondary custom-btn-width" onClick={handleAddModalClose}>Cancel</button>
                                            <button className="btn btn-success custom-btn-width" type="submit">Add</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showUpdateModal && (
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <h5>Update Doctor</h5>
                                <div className="modal-body">
                                        <form onSubmit={handleUpdateDoctorData}>
                                            <div className="form-group">
                                                <label className="fw-bold">Name:</label>
                                                <input className="form-control" type="text" name="name" value={newDoctorData.name} onChange={handleDoctorInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="fw-bold">Phone:</label>
                                                <input className="form-control" type="text" name="phone" value={newDoctorData.phone} onChange={handleDoctorInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="fw-bold">Mail:</label>
                                                <input className="form-control" type="text" name="mail" value={newDoctorData.mail} onChange={handleDoctorInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="fw-bold">Address:</label>
                                                <input className="form-control" type="text" name="address" value={newDoctorData.address} onChange={handleDoctorInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label className="fw-bold">City:</label>
                                                <input className="form-control" type="text" name="city" value={newDoctorData.city} onChange={handleDoctorInputChange} />
                                            </div>
                                            <div className="modal-buttons">
                                                <button className="mb-2 btn btn-secondary custom-btn-width" onClick={handleUpdateModalClose}>Cancel</button>
                                                <button className="btn btn-success custom-btn-width" type="submit">Update</button>
                                            </div>
                                        </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showUpdateDateModal && (
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <h5>Update Available Date</h5>
                                <div className="modal-body">

                                    <form onSubmit={handleUpdateDateData}>
                                        <div className="form-group">
                                            <label className="fw-bold">Date:</label>
                                            <input className="form-control" type="date" name="availableDate" value={newDateData.availableDate} onChange={handleDateInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="fw-bold">Doctor:</label>
                                            <select className="form-control" name="doctor" value={newDateData.doctor.id} onChange={handleDateInputChange}>
                                                <option value="" className="fw-bold">Select Doctor</option>
                                                {allDoctors.map(doctor => (
                                                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="modal-buttons">
                                            <button className="mb-2 btn btn-secondary custom-btn-width" onClick={handleUpdateDateModalClose}>Cancel</button>
                                            <button className="btn btn-success custom-btn-width" type="submit">Update</button>
                                        </div>
                                    </form>
                                </div>
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
                        {allDoctors.length > 0 ? (
                            allDoctors.map(doctor => (
                                <tr key={doctor.id}>
                                    <td className="custom-cell-border">{doctor.name}</td>
                                    <td className="custom-cell-border">{doctor.phone}</td>
                                    <td className="custom-cell-border">{doctor.mail}</td>
                                    <td className="custom-cell-border">{doctor.city}</td>
                                    <td className="custom-cell-border">{doctor.address}</td>
                                    <td className="custom-cell-border">
                                        <button className="btn btn-warning" onClick={() => handleUpdateDoctor(doctor)}>Update</button>
                                        <button className="ms-2 btn btn-danger" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="custom-cell-border" colSpan="6">Data Not Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary m-3 custom-btn-width" onClick={handleAddDateModalOpen}>Add Available Date</button>
                {showAddDateModal && (
                    <div className="custom-modal-wrapper">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <h5>Add Available Date</h5>
                                <div className="modal-body">
                                <form onSubmit={handleAddDate}>
                                    <div className="form-group">
                                        <label className="fw-bold">Date:</label>
                                        <input className="form-control" type="date" name="availableDate" value={newDateData.availableDate} onChange={handleDateInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="fw-bold">Doctor:</label>
                                        <select className="form-control" name="doctor" onChange={handleDateInputChange}>
                                            <option value="">Select Doctor</option>
                                            {allDoctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-buttons">
                                        <button className="mb-2 btn btn-secondary custom-btn-width" onClick={handleAddDateModalClose}>Cancel</button>
                                        <button className="btn btn-success custom-btn-width" type="submit">Add</button>
                                    </div>
                                </form></div>
                            </div>
                        </div>
                    </div>
                )}
                <form onSubmit={handleDateSubmit} className="mb-3">
                    <div className="m-3">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search By Date Id..."
                                value={searchDateTerm}
                                onChange={handleSearchDateChange}
                            />
                            <button className="btn btn-primary" type="submit">Search</button>
                        </div></div>
                </form>
                <table className="table table-primary table-hover">
                    <thead>
                        <tr>
                            <th className="col">Date</th>
                            <th className="col">Doctor</th>
                            <th className="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAvailableDates.length > 0 ? (
                            allAvailableDates.map(date => (
                                <tr key={date.id}>
                                    <td className="custom-cell-border">{date.availableDate}</td>
                                    <td className="custom-cell-border">{date.doctor.name}</td>
                                    <td className="custom-cell-border">
                                        <button className="btn btn-warning" onClick={() => handleUpdateDate(date)}>Update</button>
                                        <button className="ms-2 btn btn-danger" onClick={() => handleDeleteDate(date.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">Data Not Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
