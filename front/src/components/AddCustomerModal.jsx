import React, { useState } from "react";
import axios from "axios";

export default function AddCustomerModal({ handleClose }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        mail: "",
        address: "",
        city: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.mail || !formData.address || !formData.city) {
            setError("All fields are required.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/v1/customers', formData);
            handleClose();
        } catch (error) {
            console.error("Error adding customer:", error);
        }
    };

    return (
        <div className="custom-modal-wrapper">
            <div className="custom-modal">
                <div className="custom-modal-content">
                    <h5>Save Customer</h5>
                    <div className="modal-body">
                    <form>
                        <div className="form-group">
                            <label className="fw-bold">Name:</label>
                            <input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="fw-bold">Phone:</label>
                            <input className="form-control" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="fw-bold">Mail:</label>
                            <input className="form-control" type="email" name="mail" value={formData.mail} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="fw-bold">Address:</label>
                            <input className="form-control" type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label className="fw-bold">City:</label>
                            <input className="form-control" type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-success custom-btn-width" onClick={handleSubmit}>Save</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
