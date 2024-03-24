  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { toast } from 'react-toastify';

  export default function AppointmentPage() {
    const [allAppointments, setAllAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
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
    
  
    useEffect(() => {
      axios.get('https://vetappback.onrender.com/v1/appointments').then((res) => {
        setAllAppointments(res.data.data);
      });
      axios.get('https://vetappback.onrender.com/v1/doctors').then((res) => {
        setAllDoctors(res.data.data);
      });
      axios.get('https://vetappback.onrender.com/v1/animals').then((res) => {
        setAllAnimals(res.data.data);
      });
    }, []);
  
    // Update modalını handle eden arrow function
    const handleUpdateModal = (appointment) => {
      setAppointmentId(appointment.id);
      setAnimalId(appointment.animal.id);
      setDoctorId(appointment.doctor.id);
      setStart(appointment.appointmentStartDate);
      setEnd(appointment.appointmentEndDate);
      setShowUpdateModal(true);
    }
    
  
    // Update modalını kapatan arrow function
    const handleCloseUpdateModal = () => {
      setShowUpdateModal(false);
    }
  
    // Update işlemini gerçekleştiren arrow function
    const handleUpdateAppointment = async () => {
      try {
        const animalResponse = await axios.get(`https://vetappback.onrender.com/v1/animals/${animalId}`);
        const docResponse = await axios.get(`https://vetappback.onrender.com/v1/doctors/${doctorId}`);
        
        const animal = animalResponse.data.data;
        const doc = docResponse.data.data;
    
        const updatedAppointment = {
          id: appointmentId,
          appointmentStartDate: start,
          appointmentEndDate: end,
          animal: animal,
          doctor: doc
        };
    
        const response = await axios.put(`https://vetappback.onrender.com/v1/appointments/${appointmentId}`, updatedAppointment);
        toast.success(response.data.message);
        setShowUpdateModal(false);
      }  catch (error) {
        console.error('Error updating appointment:', error);
        toast.error('Error updating appointment');
      }
    };
    
    
    // Delete işlemini gerçekleştiren arrow function
    const handleDelete = async (id) => {
      try {
        await axios.delete(`https://vetappback.onrender.com/v1/appointments/${id}`);
        setAllAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== id));
        toast.success('Appointment deleted successfully');
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error('Error deleting appointment');
      }
    };
  
    // Create modal işlemleri
    const handleCreateModal = () => {
      setShowCreateModal(true);
    }
  
    const handleCloseCreateModal = () => {
      setShowCreateModal(false);
    }
  
    // Create işlemini gerçekleştiren arrow function
    const handleCreateAppointment = async () => {
      try {
        const animalResponse = await axios.get(`https://vetappback.onrender.com/v1/animals/${animalId}`);
        const docResponse = await axios.get(`https://vetappback.onrender.com/v1/doctors/${doctorId}`);
  
        const animal = animalResponse.data.data;
        const doc = docResponse.data.data;
  
        const newAppointment = {
          animal: animal,
          doctor: doc,
          appointmentStartDate: start,
          appointmentEndDate: end
        };
  
        const response = await axios.post('https://vetappback.onrender.com/v1/appointments/save', newAppointment);
        setAllAppointments(prevAppointments => [...prevAppointments, response.data.data]);
        setShowCreateModal(false);
        toast.success(response.data.message);
      } catch (error) {
        console.error('Error creating new appointment:', error);
        toast.error('Error creating new appointment');
      }
    };

    // Search işlemleri
    const handleSearchByAnimalAndDateRange = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.get(`https://vetappback.onrender.com/v1/appointments/getFilteredAppointmentsByAnimal/${name}/${start}/${end}`);
        setAllAppointments(response.data.data);
      } catch (error) {
        console.error('Error searching appointments by animal and date range:', error);
      }
    };
  
    const handleSearchByDoctorAndDateRange = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.get(`https://vetappback.onrender.com/v1/appointments/getFilteredAppointmentsByDoctor/${name}/${start}/${end}`);
        setAllAppointments(response.data.data);
      } catch (error) {
        console.error('Error searching appointments by doctor and date range:', error);
      }
    };
    
    return (
      <div>
        <button className="btn btn-primary mt-3 mb-3 ms-3 custom-btn-width" onClick={handleCreateModal}>Add Appointment</button>
        <form className="m-3">
          <div className="row">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Animal Or Doctor Name" value={name}  onChange={(e) => setName(e.target.value)} />
              <input type="datetime-local" className="form-control" value={start}  onChange={(e) => setStart(e.target.value)} />
              <input type="datetime-local" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          <div className="row">
            <div className="m-3 input-group ">
              <button className="btn btn-primary custom-btn-width-large m-2" onClick={handleSearchByAnimalAndDateRange}>Search By Animal And Date Range</button>
              <button className="btn btn-primary custom-btn-width-large m-2" onClick={handleSearchByDoctorAndDateRange}>Search By Doctor And Date Range</button>
            </div>
          </div>
      </form>
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
                  <button className="btn btn-warning" onClick={() => handleUpdateModal(searchedAppointment)}>Update</button>
                  <button className="ms-2 btn btn-danger" onClick={() => handleDelete(searchedAppointment.id)}>Delete</button>
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
                  <button type="button" onClick={handleUpdateAppointment} className="btn btn-success custom-btn-width">Save</button>
                </form>
                </div>
              </div>
            </div>
            </div>
        )}
      </div>
    );
  }
