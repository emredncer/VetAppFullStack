import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReportPage() {
    const [allReports, setAllReports] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
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
    }, []);

    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/reports');
            setAllReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    const fetchAppointmentData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/v1/appointments');
            setAllAppointments(response.data.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleAddClick = () => { setShowAddModal(true); }
    const handleCloseModal = () => { setShowAddModal(false); }

    const handleUpdateClick = (report) => {
        setSelectedReport(report);
        setShowUpdateModal(true);
    }

    const handleCloseUpdateModal = () => { setShowUpdateModal(false); }

    const handleDelete = async (reportId) => {
        try {
            await axios.delete(`http://localhost:8080/v1/reports/${reportId}`);
            fetchReportData();
        } catch (error) {
            console.error('Error deleting report:', error);
        }
    };

    const handleCreateReport = async () => {
        try {
            let findingAppointment = allAppointments.find(appointment => appointment.id === parseInt(newReportFormData.appointment));
        
            const response = await axios.post('http://localhost:8080/v1/reports', {
                diagnosis: newReportFormData.diagnosis,
                price: newReportFormData.price,
                appointment: findingAppointment,
                vaccineList: [] 
            });

            setAllReports([...allReports, response.data.data]);
            setShowAddModal(false);
            setNewReportFormData({
                diagnosis: "",
                price: 0,
                appointment: ""
            });
        } catch (error) {
            console.error("Error creating new report:", error);
        }
    }

    const handleUpdateReport = async () => {
        try {
            let findingAppointment = allAppointments.find(appointment => appointment.id === parseInt(selectedReport.appointment));

            const response = await axios.put(`http://localhost:8080/v1/reports/${selectedReport.id}`, {
                diagnosis: selectedReport.diagnosis,
                price: selectedReport.price,
                appointment: findingAppointment,
                vaccineList: []
            });

            fetchReportData();
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating report:", error);
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
