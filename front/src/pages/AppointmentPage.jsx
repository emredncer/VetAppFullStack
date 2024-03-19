import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AppointmentPage() {
  const [allAppointments, setAllAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedAppointment, setSearchedAppointment] = useState(null);
  const [doctorId, setDoctorId] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allAnimals, setAllAnimals] = useState([]);
  const [appointmentId, setAppointmentId] = useState(0);

  const handleUpdateModal = (appointment) => {
    setAppointmentId(appointment.id);
    setAnimalId(appointment.animal.id);
    setDoctorId(appointment.doctor.id);
    setStart(appointment.appointmentStartDate);
    setEnd(appointment.appointmentEndDate);
    setShowUpdateModal(true);
  }

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  }

  const handleUpdateAppointment = async () => {
    try {
      const animalResponse = await axios.get(`http://localhost:8080/v1/animals/${animalId}`);
      const docResponse = await axios.get(`http://localhost:8080/v1/doctors/${doctorId}`);

  
      const animal = animalResponse.data.data;
      const doc = docResponse.data.data;

      const updatedAppointment = {
        id: appointmentId,
        appointmentStartDate: start,
        appointmentEndDate: end,
        animal: animal,
        doctor: doc
      };

      const response = await axios.put(`http://localhost:8080/v1/appointments/${appointmentId}`, updatedAppointment);
  
      const updatedAppointments = allAppointments.map(appointment => {
        if (appointment.id === searchedAppointment.id) {
          return {
            ...appointment,
            appointmentStartDate: updatedAppointment.appointmentStartDate,
            appointmentEndDate: updatedAppointment.appointmentEndDate,
            animal: updatedAppointment.animal,
            doctor: updatedAppointment.doctor
          };
        }
        return appointment;
      });
  
      setAllAppointments(updatedAppointments);
      setShowUpdateModal(false);
    }  catch (error) {
      const errorMessage = error.response || error;
    }
  };
  
  

  useEffect(() => {
    axios.get('http://localhost:8080/v1/appointments').then((res) => {
      setAllAppointments(res.data.data);
    });
    axios.get('http://localhost:8080/v1/doctors').then((res) => {
      setAllDoctors(res.data.data);
    });
    axios.get('http://localhost:8080/v1/animals').then((res) => {
      setAllAnimals(res.data.data);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/v1/appointments/${id}`);
      setAllAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleCreateModal = () => {
    setShowCreateModal(true);
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  }

  const handleCreateAppointment = async () => {
    try {
      const animalResponse = await axios.get(`http://localhost:8080/v1/animals/${animalId}`);
      const docResponse = await axios.get(`http://localhost:8080/v1/doctors/${doctorId}`);

      const animal = animalResponse.data.data;
      const doc = docResponse.data.data;

      const newAppointment = {
        animal: animal,
        doctor: doc,
        appointmentStartDate: start,
        appointmentEndDate: end
      };

      const response = await axios.post('http://localhost:8080/v1/appointments/save', newAppointment);
      setAllAppointments(prevAppointments => [...prevAppointments, response.data.data]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating new appointment:', error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const foundAppointment = allAppointments.find(appointment => appointment.id === parseInt(searchTerm));
    setSearchedAppointment(foundAppointment);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value === '') {
      setSearchedAppointment(null);
    }
  };

  return (
    <div>
      <button className="btn btn-primary mt-3 mb-3 ms-3 custom-btn-width" onClick={handleCreateModal}>Add Appointment</button>
      {showCreateModal && (
        <div className="custom-modal-wrapper">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h5>Create Appointment</h5>
              <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="animalId">Animal:</label>
                  <select className="form-control" id="animalId" value={animalId} onChange={(e) => setAnimalId(e.target.value)}>
                    <option value="">Select Animal</option>
                    {allAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="doctorId">Doctor:</label>
                  <select className="form-control" id="doctorId" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {allDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="start">Start Date:</label>
                  <input className="form-control" type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="end">End Date:</label>
                  <input className="form-control" type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>
                <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseCreateModal}>Close</button>
                <button type="button" className="btn btn-success custom-btn-width" onClick={handleCreateAppointment}>Save</button>
              </form>
              </div>
            </div>
          </div>
          </div>
      )}
      <form onSubmit={handleSubmit} className="mt-0 m-3">
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
            <th className="col">Animal Name</th>
            <th className="col">Appointment Start Date</th>
            <th className="col">Appointment End Date</th>
            <th className="col">Doctor</th>
            <th className="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchedAppointment ? (
            <tr key={searchedAppointment.id}>
              <td className="custom-cell-border">{searchedAppointment.animal.name}</td>
              <td className="custom-cell-border">{searchedAppointment.appointmentStartDate}</td>
              <td className="custom-cell-border">{searchedAppointment.appointmentEndDate}</td>
              <td className="custom-cell-border">{searchedAppointment.doctor.name}</td>
              <td className="custom-cell-border">
                <button onClick={() => handleUpdateModal(searchedAppointment)}>Update</button>
                <button onClick={() => handleDelete(searchedAppointment.id)}>Delete</button>
              </td>
            </tr>
          ) : allAppointments.map(appointment => (
            <tr key={appointment.id}>
              <td className="custom-cell-border">{appointment.animal.name}</td>
              <td className="custom-cell-border">{appointment.appointmentStartDate}</td>
              <td className="custom-cell-border">{appointment.appointmentEndDate}</td>
              <td className="custom-cell-border">{appointment.doctor.name}</td>
              <td className="custom-cell-border">
                <button className="btn btn-warning"  onClick={() => handleUpdateModal(appointment)}>Update</button>
                <button className="ms-2 btn btn-danger" onClick={() => handleDelete(appointment.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {searchTerm !== '' && !searchedAppointment && (
            <tr>
              <td colSpan="5">Data not found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showUpdateModal && (
        <div className="custom-modal-wrapper">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h2>Update Appointment</h2>
              <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="animalId">Animal:</label>
                  <select className="form-control" id="animalId" value={animalId} onChange={(e) => setAnimalId(e.target.value)}>
                    <option value="">Select Animal</option>
                    {allAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="doctorId">Doctor:</label>
                  <select className="form-control" id="doctorId" value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                    <option value="">Select Doctor</option>
                    {allDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="start">Start Date:</label>
                  <input className="form-control" type="datetime-local" id="start" value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="fw-bold" htmlFor="end">End Date:</label>
                  <input className="form-control" type="datetime-local" id="end" value={end} onChange={(e) => setEnd(e.target.value)} />
                </div>                                
                <button type="button" className="mt-2 mb-2 btn btn-secondary custom-btn-width" onClick={handleCloseUpdateModal}>Close</button>
                <button type="button" className="btn btn-success custom-btn-width" onClick={handleUpdateAppointment}>Save</button>
              </form>
              </div>
            </div>
          </div>
          </div>
      )}
    </div>
  );
}
