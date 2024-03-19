import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function VaccinePage() {
  const [allVaccines, setAllVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateVaccineData, setUpdateVaccineData] = useState({
    id:'',
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animal: {}
  });

  const [newVaccineFormData, setNewVaccineFormData] = useState({
    name: '',
    code: '',
    protectionStartDate: '',
    protectionFinishDate: '',
    animal: ''
  });



  const [allAnimals, setAllAnimals] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/v1/vaccines').then((res) => {
      setAllVaccines(res.data.data);
    });
    axios.get('http://localhost:8080/v1/animals').then((res) => {
      setAllAnimals(res.data.data);
    });
  }, []);

  const handleUpdate = (vaccine) => {
    const data = {
      id: vaccine.id,
      name: vaccine.name, 
      code: vaccine.code,
      protectionStartDate: vaccine.protectionStartDate,
      protectionFinishDate: vaccine.protectionFinishDate,
      animal: vaccine.animal
    }
    setUpdateVaccineData(data);
    setShowUpdateModal(true);
  };

  const handleSubmitUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/v1/vaccines/${updateVaccineData.id}`, updateVaccineData);
      const updatedVaccines = allVaccines.map(v => (v.id === updateVaccineData.id ? response.data.data : v));
      setAllVaccines(updatedVaccines);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating vaccine:", error);
    }
  };

  const handleCreateVaccine = async () => {
    try {
      const animalObject = allAnimals.find(animal => animal.id === parseInt(newVaccineFormData.animal))

      const newDataWithCustomer = {
        ...newVaccineFormData,
        animal: animalObject
      };

      const response = await axios.post('http://localhost:8080/v1/vaccines', newDataWithCustomer);

      setAllVaccines([...allVaccines, response.data.data]);
      setShowCreateModal(false);

      setNewVaccineFormData({
        name: '',
        code: '',
        protectionStartDate: '',
        protectionFinishDate: '',
        animal: ''
      });
    } catch (error) {
      console.error('Error creating new vaccine:', error);
    }
  };

  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setNewVaccineFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdateInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateVaccineData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDelete = async (vaccineId) => {
    try {
      await axios.delete(`http://localhost:8080/v1/vaccines/${vaccineId}`);
      setAllVaccines(allVaccines.filter(vaccine => vaccine.id !== vaccineId));
    } catch (error) {
      console.error("Error deleting vaccine:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/v1/vaccines/${searchTerm}`);
      setAllVaccines([response.data.data]);
    } catch (error) {
      console.error("Error fetching vaccines filtered by name:", error);
    }
  }

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (!value) {
      axios.get('http://localhost:8080/v1/vaccines').then((res) => {
        setAllVaccines(res.data.data);
      });
    }
  }

  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
  }

  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
  }

  const handleFindByDateRange = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/vaccines/getAnimalsFilteredVaccinesByDate/${startDate}/${endDate}`);
      setAllVaccines(response.data.data);
    } catch (error) {
      console.error("Error fetching vaccines by date range:", error);
    }
  }

  const handleGetAllVaccinesByAnimalId = async (animalId) => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/vaccines/animalsAllVaccines/${animalId}`);
      setAllVaccines(response.data.data);
    } catch (error) {
      console.error("Error fetching vaccines for animal:", error);
    }
  }

  const handleGetVaccinesInRange = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/v1/vaccines/inRange/${startDate}/${endDate}`);
      setAllVaccines(response.data.data);
    } catch (error) {
      console.error("Error fetching vaccines in range:", error);
    }
  }

  const handleAddModal = async () => {
    setShowCreateModal(true);
  }
  return (
    <div>
      <button onClick={handleAddModal} className="m-3">Add Vaccine</button>

      {showCreateModal && (
        <div className="custom-modal-wrapper">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h5>Create Vaccine</h5>
              <div className="modal-body">
              <form>
                <div className="form-group">
                  <label className="fw-bold">Name:</label>
                  <input className="form-control" type="text" name="name" value={newVaccineFormData.name} onChange={handleCreateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Code:</label>
                  <input className="form-control" type="text" name="code" value={newVaccineFormData.code} onChange={handleCreateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Protection Start Date:</label>
                  <input className="form-control" type="date" name="protectionStartDate" value={newVaccineFormData.protectionStartDate} onChange={handleCreateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Protection Finish Date:</label>
                  <input className="form-control" type="date" name="protectionFinishDate" value={newVaccineFormData.protectionFinishDate} onChange={handleCreateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Animal:</label>
                  <select className="form-control" name="animal" value={newVaccineFormData.animal} onChange={handleCreateInputChange}>
                    <option value="">Select Animal</option>
                    {allAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                  <button className="mb-2 btn btn-secondary custom-btn-width" onClick={() => setShowCreateModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-success custom-btn-width" onClick={handleCreateVaccine}>Create</button>
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
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>

      <div className="m-3 ">
        <label className="fw-bold me-3">Start Date: </label>
        <input
          type="date"
          className='me-3'
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label className="fw-bold mx-3">End Date: </label>
        <input
        className='me-3'
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <button className="btn btn-primary custom-btn-width-small " onClick={handleFindByDateRange}>Find by Date Range</button>
      </div>

      <div className="m-3 input-group">
        <input className="form-control" type="text" placeholder="Enter Animal Id" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button className="btn btn-primary custom-btn-width-x-small "  onClick={() => handleGetAllVaccinesByAnimalId(searchTerm)}>Filter Vaccines</button>
      </div>


      <div className="m-3">
        <label  className="fw-bold me-3">Start Date: </label>
        <input
        className='me-3'
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <label  className="fw-bold mx-3">End Date: </label>
        <input
        className='me-3'
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
        />
        <button className="btn btn-primary custom-btn-width-small" onClick={handleGetVaccinesInRange}>Get Vaccines in Range</button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Protection Start Date</th>
            <th>Protection Finish Date</th>
            <th>Animal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allVaccines.map(vaccine => (
            <tr key={vaccine.id}>
              <td>{vaccine.name}</td>
              <td><div className="tableColor" style={{ backgroundColor: vaccine.code, fontWeight: 'bold', color: 'white' }}>
                {vaccine.code}
              </div></td>
              <td>{vaccine.protectionStartDate}</td>
              <td>{vaccine.protectionFinishDate}</td>
              <td>{vaccine.animal ? vaccine.animal.name : 'N/A'}</td>
              <td>
                <button onClick={() => handleUpdate(vaccine)}>Update</button>
                <button onClick={() => handleDelete(vaccine.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showUpdateModal && (
        <div className="modal-wrapper">
          <div className="modal">
            <div className="modal-content">
              <div className="modalCloseButton">
                <button className="close" onClick={() => setShowUpdateModal(false)}>×</button>
              </div>
              <h2>Update Vaccine</h2>
              <form onSubmit={handleSubmitUpdate}>
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={updateVaccineData.name} onChange={handleUpdateInputChange} />
                </div>
                <div>
                  <label>Code:</label>
                  <input type="text" name="code" value={updateVaccineData.code} onChange={handleUpdateInputChange} />
                </div>
                <div>
                  <label>Protection Start Date:</label>
                  <input type="date" name="protectionStartDate" value={updateVaccineData.protectionStartDate} onChange={handleUpdateInputChange} />
                </div>
                <div>
                  <label>Protection Finish Date:</label>
                  <input type="date" name="protectionFinishDate" value={updateVaccineData.protectionFinishDate} onChange={handleUpdateInputChange} />
                </div>
                <div>
                  <label>Animal:</label>
                  <select name="animal" value={updateVaccineData.animal} onChange={handleUpdateInputChange}>
                    <option value="">Select Animal</option>
                    {allAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-buttons">
                  <button type="submit">Update</button>
                  <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};