import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function DoctorPage() {
    const [allDoctors, setAllDoctors] = useState(null);
    const [allAvailableDates, setAllAvailableDates] = useState(null);
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
        axios.get('https://vetappback.onrender.com/v1/doctors').then((res) => {
            setAllDoctors(res.data.data);
        });
    }, []);

    useEffect(() => {
        axios.get('https://vetappback.onrender.com/v1/availableDates').then((res) => {
            setAllAvailableDates(res.data.data);
        });
    }, []);

    // Doktor silme işlemi
    const handleDeleteDoctor = async (id) => {
        try {
            let response = await axios.delete(`https://vetappback.onrender.com/v1/doctors/${id}`);
            setAllDoctors(allDoctors.filter(doctor => doctor.id !== id));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error deleting doctor:", error);
            toast.error("An error occured.");
        }
    };

    // Doktor update işlemi handle eden arrow function
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

    // Modal ve input işlemleri
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

    // Doktor ekleme işlemi
    const handleAddDoctor = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://vetappback.onrender.com/v1/doctors', newDoctorData);
            toast.success(response.data.message);
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
            event.preventDefault();
            if (error.response) {
                console.error("Error adding new doctor:", error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                console.error("Error adding new doctor:", error.message);
                toast.error("An error occurred.");
            }
        }
    };
    
    // Doktor güncelleme işlemi
    const handleUpdateDoctorData = async () => {
        try {
            const response = await axios.put(`https://vetappback.onrender.com/v1/doctors/${selectedDoctor.id}`, newDoctorData);
            const updatedDoctors = allDoctors.map(doctor => {
                if (doctor.id === selectedDoctor.id) {
                    return { ...doctor, ...newDoctorData };
                }
                return doctor;
            });
            toast.success(response.data.message);
            setAllDoctors(updatedDoctors);
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating doctor:", error);
            toast.error("An error occured.");
        }
    };

    // Modal ve input işlemleri
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

    // Available date ekleme işlemi
    const handleAddDate = async (event) => {
        event.preventDefault();
        try {
            const selectedDoctor = await axios.get(`https://vetappback.onrender.com/v1/doctors/${newDateData.doctor}`).then((res) => { return res.data.data })
            const response = await axios.post('https://vetappback.onrender.com/v1/availableDates', {
                availableDate: newDateData.availableDate,
                doctor: selectedDoctor
            });
            console.log(response);
            toast.success(response.data.message);
            setAllAvailableDates([...allAvailableDates, response.data.data]);
            setShowAddDateModal(false);
            setNewDateData({
                availableDate: "",
                doctor: ""
            });
        } catch (error) {
            console.error("Error adding new date:", error);
            toast.error("An error occured.");
        }

    };

    // Available date update işlemini handle eden arrow function
    const handleUpdateDate = (date) => {
        setSelectedDate(date);
        setShowUpdateDateModal(true);
        setNewDateData({
            availableDate: date.availableDate,
            doctor: date.doctor
        });
    };

    // Available date update işlemi
    const handleUpdateDateData = async () => {
        try {
            const response = await axios.put(`https://vetappback.onrender.com/v1/availableDates/${selectedDate.id}`, newDateData);
            console.log(response);
            const updatedDates = allAvailableDates.map(date => {
                if (date.id === selectedDate.id) {
                    return { ...date, ...newDateData };
                }
                return date;
            });
            toast.success(response.data.message);
            setAllAvailableDates(updatedDates);
            setShowUpdateDateModal(false);
        } catch (error) {
            console.error("Error updating date:", error);
            toast.error("An error occured.");
        }
    };

    // Available date silme işlemi
    const handleDeleteDate = async (id) => {
        try {
            let response = await axios.delete(`https://vetappback.onrender.com/v1/availableDates/${id}`);
            setAllAvailableDates(allAvailableDates.filter(date => date.id !== id));
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error deleting date:", error);
            toast.error("An error occured.");
        }
    };

    // Search işlemleri
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (!value) {
            axios.get('https://vetappback.onrender.com/v1/doctors').then((res) => {
                setAllDoctors(res.data.data);
            });
        }
    };

    const handleSearchDateChange = (event) => {
        const value = event.target.value;
        setSearchDateTerm(value);
        if (!value) {
            axios.get('https://vetappback.onrender.com/v1/availableDates').then((res) => {
                setAllAvailableDates(res.data.data);
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (searchTerm) {
                const response = await axios.get(`https://vetappback.onrender.com/v1/doctors/${searchTerm}`);
                setAllDoctors([response.data.data]);
                console.info(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors filtered by name:", error);
            toast.error("An error occured.");
        }
    };

    const handleDateSubmit = async (event) => {
        event.preventDefault();
        try {
            if (searchDateTerm) {
                const response = await axios.get(`https://vetappback.onrender.com/v1/availableDates/${searchDateTerm}`);
                setAllAvailableDates([response.data.data]);
                console.info(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching available dates filtered by id:", error);
            toast.error("An error occured.");
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
                                    <form>
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
                                            <button className="btn btn-success custom-btn-width" onClick={handleAddDoctor}>Add</button>
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
                                        <form>
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
                                                <button className="btn btn-success custom-btn-width" onClick={handleUpdateDoctorData}>Update</button>
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

                                    <form>
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
                                            <button onClick={handleUpdateDateData} className="btn btn-success custom-btn-width">Update</button>
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
                        {allDoctors && allDoctors.length > 0 ? (
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
                                <form>
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
                                        <button className="btn btn-success custom-btn-width" onClick={handleAddDate}>Add</button>
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
                    {allAvailableDates && allAvailableDates.length > 0 ? (
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
