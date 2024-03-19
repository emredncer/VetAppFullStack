package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IDoctorService;
import emre.dincer.VeterinaryManagementSystem.dao.IDoctorRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Customer;
import emre.dincer.VeterinaryManagementSystem.entities.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.List;

@Service
public class DoctorManager implements IDoctorService {
    //DI constructor injection
    private final IDoctorRepo doctorRepo;

    @Autowired
    public DoctorManager(IDoctorRepo doctorRepo) {
        this.doctorRepo = doctorRepo;
    }
    //Değerlendirme formu 12
    public SingleResult<Doctor> saveDoctor(Doctor doctor) {
        try {
            String doctorMail = doctor.getMail();

            // Mail adresi bu senaryo için ayırt edici bir özellik.
            if (!doctorRepo.existsByMail(doctorMail)) { //Varolan bir veri mi kontrolü.
                Doctor entityResult = doctorRepo.save(doctor);
                if (entityResult != null) {
                    SingleResult<Doctor> result = new SingleResult<>();
                    result.setData(entityResult);
                    result.setCode(200);
                    result.setMessage("Doctor saved Successfully");
                    return result;
                }
                SingleResult<Doctor> result = new SingleResult<>();
                result.setCode(404);
                result.setMessage("An error occured.");
                return result;
            } else {
                throw new RuntimeException("A doctor with the same email already exists.");
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving doctor: " + e.getMessage());
        }
    }
    //tüm doktorları getir
    public ManyResult<Doctor> getAllDoctors() {
        try {
            List<Doctor> entityResult = doctorRepo.findAll();
            if (entityResult != null) {
                ManyResult<Doctor> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Doctor> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching all doctors: " + e.getMessage());
        }
    }
    //tek bir doktoru getir
    public SingleResult<Doctor> getDoctorById(Long id) {
        try {
            Doctor entityResult=  doctorRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
            if (entityResult != null) {
                SingleResult<Doctor> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            SingleResult<Doctor> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("Appointment not found with id:  " + id);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching doctor with id: " + id + ": " + e.getMessage());
        }
    }

    public SingleResult<Doctor> updateDoctor(Doctor doctor) {
        try {
            Doctor entityResult = doctorRepo.save(doctor);
            if (entityResult != null) {
                SingleResult<Doctor> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<Doctor> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occured.");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating doctor: " + e.getMessage());
        }
    }

    public void deleteDoctor(Long id) {
        try {
            doctorRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while deleting doctor with id: " + id + ": " + e.getMessage());
        }
    }
}