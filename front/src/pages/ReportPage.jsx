import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReportPage() {
    const [allReports, setAllReports] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [allVaccines, setAllVaccines] = useState([]);
    const [newReportFormData, setNewReportFormData] = useState({
        diagnosis: "",
        price: 0,
        appointment: ""
    });
    const [selectedReport, setSelectedReport] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        fetchReportData();
        fetchAppointmentData();
        fetchVaccineData();
    }, []);


    // Vaccine entity'si read işlemi
    const fetchVaccineData = async () => {
        try {
            const response = await axios.get('https://vetappback.onrender.com/v1/vaccines');
            setAllVaccines(response.data.data);
        } catch (error) {
            console.error('Error fetching vaccines:', error);
        }
    };
    // Report entity'si read işlemi
    const fetchReportData = async () => {
        try {
            const response = await axios.get('https://vetappback.onrender.com/v1/reports');
            setAllReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    // Appointment entity'si read işlemi
    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get('https://vetappback.onrender.com/v1/appointments');
            setAllAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    // Modal işlemleri
    const handleAddClick = () => { setShowAddModal(true); }
    const handleCloseModal = () => { setShowAddModal(false); }

    const handleUpdateClick = (report) => {
        setSelectedReport(report);
        setShowUpdateModal(true);
    }

    const handleCloseUpdateModal = () => { setShowUpdateModal(false); }

    // Report silme işlemi
    const handleDelete = async (reportId) => {
        try {
            var response = await axios.delete(`https://vetappback.onrender.com/v1/reports/${reportId}`);
            fetchReportData();
            toast.success(response.data.message);
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error("Error deleting report");
        }
    };

    // Report oluşturma işlemi
    const handleCreateReport = async () => {
        try {
            let findingAppointment = allAppointments.find(appointment => appointment.id === parseInt(newReportFormData.appointment));
        
            const response = await axios.post('https://vetappback.onrender.com/v1/reports', {
                diagnosis: newReportFormData.diagnosis,
                price: newReportFormData.price,
                appointment: findingAppointment,
                vaccineList: newReportFormData.vaccineList
            });

            toast.success(response.data.message);
            setAllReports([...allReports, response.data.data]);
            setShowAddModal(false);
            setNewReportFormData({
                diagnosis: "",
                price: 0,
                appointment: "",
                vaccineList: newReportFormData.vaccineList
            });
        } catch (error) {
            console.error("Error creating new report:", error);
            toast.error("Error creating new report");
        }
    }
    
    // Report güncelleme işlemi
    const handleUpdateReport = async () => {
        try {
            let findingAppointment = allAppointments.find(appointment => appointment.id === parseInt(selectedReport.appointment));
    
            const response = await axios.put(`https://vetappback.onrender.com/v1/reports/${selectedReport.id}`, {
                diagnosis: selectedReport.diagnosis,
                price: selectedReport.price,
                appointment: findingAppointment,
                vaccineList: selectedReport.vaccineList
            });
            fetchReportData();
            setShowUpdateModal(false);
            toast.success(response.data.message);
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Error updating report");
        }
    }

    return (
        <div>
            <button className="btn btn-primary mt-3 mb-3 ms-3 custom-btn-width" onClick={handleAddClick}>Add Report</button>
            <table className="table table-primary table-hover">
                <thead>
                    <tr>
                        <th className="col">Diagnosis</th>
                        <th className="col">Price</th>
                        <th className="col">Appointment Date</th>
                        <th className="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allReports.map(report => (
                        <tr key={report.id}>
                            <td className="custom-cell-border">{report.diagnosis}</td>
                            <td className="custom-cell-border">{report.price}</td>
                            <td className="custom-cell-border">{report.appointment ? report.appointment.appointmentStartDate : 'N/A'}</td>
                            <td className="custom-cell-border">
                                <button className="btn btn-warning" onClick={() => handleUpdateClick(report)}>Update</button>
                                <button className="ms-2 btn btn-danger" onClick={() => handleDelete(report.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="custom-modal-wrapper">
                <div className="custom-modal">
                    <div className="custom-modal-content">
                        <h5>Save Report</h5>
                        <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label className="fw-bold">Diagnosis:</label>
                                <input className="form-control" type="text" name="diagnosis" value={newReportFormData.diagnosis} onChange={(e) => setNewReportFormData({ ...newReportFormData, diagnosis: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Price:</label>
                                <input className="form-control" type="number" name="price" value={newReportFormData.price} onChange={(e) => setNewReportFormData({ ...newReportFormData, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Appointment:</label>
                                <select className="form-control" name="appointment" value={newReportFormData.appointment} onChange={(e) => setNewReportFormData({ ...newReportFormData, appointment: e.target.value })}>
                                    <option value="">Select Appointment</option>
                                    {allAppointments.map(appointment => (
                                        <option key={appointment.id} value={appointment.id}>{appointment.appointmentStartDate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Vaccines:</label>
                                <select multiple className="form-control" name="vaccines" value={selectedReport ? (selectedReport.vaccineList ? selectedReport.vaccineList.map(vaccine => vaccine.id) : []) : []} onChange={(e) => setSelectedReport({ ...selectedReport, vaccineList: Array.from(e.target.selectedOptions, option => ({ id: option.value })) })}>
                                    <option value="">Select Vaccine</option>
                                    {allVaccines.map(vaccine => (
                                        <option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
                                    ))}
                                </select>


                            </div>
                            <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseModal}>Close</button>
                        <button type="button" className="btn btn-success custom-btn-width" onClick={handleCreateReport}>Save</button>
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
                        <h5>Update Report</h5>
                        <form>
                            <div  className="form-group">
                                <label className="fw-bold">Diagnosis:</label>
                                <input className="form-control" type="text" name="diagnosis" value={selectedReport.diagnosis} onChange={(e) => setSelectedReport({ ...selectedReport, diagnosis: e.target.value })} />
                            </div>
                            <div  className="form-group">
                                <label className="fw-bold">Price:</label>
                                <input className="form-control" type="number" name="price" value={selectedReport.price} onChange={(e) => setSelectedReport({ ...selectedReport, price: e.target.value })} />
                            </div>
                            <div  className="form-group">
                                <label className="fw-bold">Appointment:</label>
                                <select className="form-control" name="appointment" value={selectedReport.appointment} onChange={(e) => setSelectedReport({ ...selectedReport, appointment: e.target.value })}>
                                    <option value="">Select Appointment</option>
                                    {allAppointments.map(appointment => (
                                        <option key={appointment.id} value={appointment.id}>{appointment.appointmentStartDate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="fw-bold">Vaccines:</label>
                                <select multiple className="form-control" name="vaccines" value={selectedReport ? (selectedReport.vaccineList ? selectedReport.vaccineList.map(vaccine => vaccine.id) : []) : []} onChange={(e) => setSelectedReport({ ...selectedReport, vaccineList: Array.from(e.target.selectedOptions, option => ({ id: option.value })) })}>
                                    <option value="">Select Vaccine</option>
                                    {allVaccines.map(vaccine => (
                                        <option key={vaccine.id} value={vaccine.id}>{vaccine.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseUpdateModal}>Close</button>
                        <button type="button" className="btn btn-success custom-btn-width" onClick={handleUpdateReport}>Save</button>
                        </form>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}
