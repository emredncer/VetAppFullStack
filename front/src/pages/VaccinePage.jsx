import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    axios.get('https://vetappback.onrender.com/v1/vaccines').then((res) => {
      setAllVaccines(res.data.data);
    });
    axios.get('https://vetappback.onrender.com/v1/animals').then((res) => {
      setAllAnimals(res.data.data);
    });
  }, []);

  // Update işlemini handle eden arrow function
  const handleUpdate = (vaccine) => {
    console.log(vaccine);
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

  
  // Update işlemi submit edildiğinde çalışan arrow function
  const handleSubmitUpdate = async (event) => {
    event.preventDefault();
    try {
      let animal = allAnimals.find(animal => animal.id === parseInt(updateVaccineData.animal));
        updateVaccineData.animal = animal;
        
        const response = await axios.put(`https://vetappback.onrender.com/v1/vaccines/${updateVaccineData.id}`, updateVaccineData);
        const updatedVaccines = allVaccines.map(v => (v.id === updateVaccineData.id ? response.data.data : v));
        setAllVaccines(updatedVaccines);
        setShowUpdateModal(false);
        toast.success(response.data.message);
    } catch (error) {
        console.error("Error updating vaccine:", error);
        toast.error("Error updating vaccine");
    }
};

  
  // Create işlemini handle eden arrow function
  const handleCreateVaccine = async (event) => {
    event.preventDefault();
    try {
        const animalObject = allAnimals.find(animal => animal.id === parseInt(newVaccineFormData.animal))

        const newDataWithCustomer = {
            ...newVaccineFormData,
            animal: animalObject,
            report_id: null
        };

        console.log(newDataWithCustomer);

        const response = await axios.post('https://vetappback.onrender.com/v1/vaccines', newDataWithCustomer);
        console.log(response);
        setAllVaccines([...allVaccines, response.data.data]);
        setShowCreateModal(false);

        setNewVaccineFormData({
            name: '',
            code: '',
            protectionStartDate: '',
            protectionFinishDate: '',
            animal: ''
        });

        toast.success(response.data.message);
    } catch (error) {
        console.error('Error creating new vaccine:', error);
        toast.error("Error creating new vaccine");
    }
};

  
  // Create işlemi formunun inputları değiştiğinde çalışan arrow function
  const handleCreateInputChange = (event) => {
    const { name, value } = event.target;
    setNewVaccineFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Update işlemi formunun inputları değiştiğinde çalışan arrow function
  const handleUpdateInputChange = (event) => {
    const { name, value } = event.target;
    setUpdateVaccineData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  // Delete işlemini handle eden arrow function
  const handleDelete = async (vaccineId) => {
    try {
        let response = await axios.delete(`https://vetappback.onrender.com/v1/vaccines/${vaccineId}`);
        setAllVaccines(allVaccines.filter(vaccine => vaccine.id !== vaccineId));
        toast.success(response.data.message);
    } catch (error) {
        console.error("Error deleting vaccine:", error);
        toast.error("Error deleting vaccine");
    }
};

  // Filtreleme işleminde kullanılan start date inputu değiştiğinde çalışan arrow function
  const handleStartDateChange = (event) => {
    const value = event.target.value;
    setStartDate(value);
  }

  // Filtreleme işleminde kullanılan end date inputu değiştiğinde çalışan arrow function
  const handleEndDateChange = (event) => {
    const value = event.target.value;
    setEndDate(value);
  }

  // Tarih aralığına göre filtreleme işlemini gerçekleştiren arrow function
  const handleFindByDateRange = async (event) => {
    event.preventDefault()
    try {
        const response = await axios.get(`https://vetappback.onrender.com/v1/vaccines/getAnimalsFilteredVaccinesByDate/${startDate}/${endDate}`);
        setAllVaccines(response.data.data);
        toast.info(response.data.message);
    } catch (error) {
        console.error("Error fetching vaccines by date range:", error);
        toast.error("Error fetching vaccines by date range");
    }
}

  // Hayvana göre filtreleme işlemini gerçekleştiren arrow function
  const handleGetAllVaccinesByAnimalId = async (name, e) => {
    e.preventDefault();
    try {
      let animal = allAnimals.find(x => x.name === name)
        const response = await axios.get(`https://vetappback.onrender.com/v1/vaccines/animalsAllVaccines/${animal.id}`);
        setAllVaccines(response.data.data);
        toast.info(response.data.message);
    } catch (error) {
        console.error("Error fetching vaccines for animal:", error);
        toast.error("Error fetching vaccines for animal");
    }
}

  // Tarih aralığına göre filtreleme işlemini gerçekleştiren arrow function
  const handleGetVaccinesInRange = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.get(`https://vetappback.onrender.com/v1/vaccines/inRange/${startDate}/${endDate}`);
        setAllVaccines(response.data.data);
        toast.info(response.data.message);
    } catch (error) {
        console.error("Error fetching vaccines in range:", error);
        toast.error("Error fetching vaccines in range");
    }
}

  // Add modalı açan arrow function
  const handleAddModal = async () => {
    setShowCreateModal(true);
  }

  const handleFilterByNameAndDates = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`https://vetappback.onrender.com/v1/vaccines/getAnimalsFilteredVaccinesByDate/${searchTerm}/${startDate}/${endDate}`);
      console.log(startDate);
      setAllVaccines(response.data.data);
      toast.info(response.data.message);
    } catch (error) {
      console.error("Error fetching filtered vaccines by date:", error);
      toast.error("Error fetching filtered vaccines by date");
    }
  }

  return (
    <div>
      <button onClick={handleAddModal} className="btn btn-primary m-3 custom-btn-width">Add Vaccine</button>


      {showUpdateModal && (
        <div className="custom-modal-wrapper">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h5>Update Vaccine</h5>
              <div className="modal-body">
              <form onSubmit={handleSubmitUpdate}>
                <div className="form-group">
                  <label className="fw-bold">Name:</label>
                  <input className="form-control" type="text" name="name" value={updateVaccineData.name} onChange={handleUpdateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Code:</label>
                  <input className="form-control" type="text" name="code" value={updateVaccineData.code} onChange={handleUpdateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Protection Start Date:</label>
                  <input className="form-control" type="date" name="protectionStartDate" value={updateVaccineData.protectionStartDate} onChange={handleUpdateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Protection Finish Date:</label>
                  <input className="form-control" type="date" name="protectionFinishDate" value={updateVaccineData.protectionFinishDate} onChange={handleUpdateInputChange} />
                </div>
                <div className="form-group">
                  <label className="fw-bold">Animal:</label>
                  <select className="form-control" name="animal" value={updateVaccineData.animal} onChange={handleUpdateInputChange}>
                    <option value="">Select Animal</option>
                    {allAnimals.map(animal => (
                      <option key={animal.id} value={animal.id}>{animal.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-buttons">
                  <button className="mb-2 btn btn-secondary custom-btn-width" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                  <button className="btn btn-success custom-btn-width" type="submit">Update</button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}

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

      <form className="m-2">
      <div className="row custom-div-width">
        <div className="input-group">
          <input className="mx-auto form-control" type="text" placeholder="Enter Animal Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <input className='mx-auto form-control' type="date" value={startDate} onChange={handleStartDateChange}/>
          <input className='mx-auto form-control' type="date" value={endDate} onChange={handleEndDateChange}/>
        </div>
      </div>

      
      <div className="row custom-div-width">
            <div className="m-2 input-group">
              <button className="mx-auto btn btn-primary custom-btn-width-large custom-btn-text-size" onClick={(e) => handleFindByDateRange(e)}>Find By Protection Start Date</button>
              <button className="mx-auto btn btn-primary custom-btn-width-large custom-btn-text-size"  onClick={(e) => handleFilterByNameAndDates(e)}>Filter Vaccines By Animal Name And Date Range</button>
              <button className="mx-auto btn btn-primary custom-btn-width-large custom-btn-text-size"  onClick={(e) => handleGetAllVaccinesByAnimalId(searchTerm,e)}>Filter Vaccines By Animal Name</button>
              <button className="mx-auto btn btn-primary custom-btn-width-large custom-btn-text-size" onClick={(e) => handleGetVaccinesInRange(e)}>Filter Vaccines By Date</button>  
            </div>
      </div>

      </form>





      

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
              <td>{vaccine.name && vaccine.name ? vaccine.name : 'N/A'}</td>

              <td><div className="tableColor" style={{ backgroundColor: vaccine.code, fontWeight: 'bold', color: 'white' }}>
                {vaccine.code}
              </div></td>
              <td>{vaccine.protectionStartDate}</td>
              <td>{vaccine.protectionFinishDate}</td>
              <td>{vaccine.animal && vaccine.animal.name ? vaccine.animal.name : 'N/A'}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleUpdate(vaccine)}>Update</button>
                <button className="ms-2 btn btn-danger" onClick={() => handleDelete(vaccine.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};