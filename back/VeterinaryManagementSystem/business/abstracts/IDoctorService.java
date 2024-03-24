package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Doctor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IDoctorService {
    public SingleResult<Doctor> saveDoctor(Doctor doctor);

    public ManyResult<Doctor> getAllDoctors();

    public SingleResult<Doctor> getDoctorById(Long id);

    public SingleResult<Doctor> updateDoctor(Doctor doctor);

    public void deleteDoctor(Long id);

}
