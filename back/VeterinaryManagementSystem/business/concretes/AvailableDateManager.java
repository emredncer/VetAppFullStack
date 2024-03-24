package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAvailableDateService;
import emre.dincer.VeterinaryManagementSystem.dao.IAvailableDateRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.AvailableDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AvailableDateManager implements IAvailableDateService {
    //DI constructor injection
    private final IAvailableDateRepo availableDateRepo;

    @Autowired
    public AvailableDateManager(IAvailableDateRepo availableDateRepo) {
        this.availableDateRepo = availableDateRepo;
    }
    //Değerlendirme formu 13
    public SingleResult<AvailableDate> saveAvailableDate(AvailableDate availableDate) {
        try {
            Long doctorId = availableDate.getDoctor().getId();
            LocalDate date = availableDate.getAvailableDate();

            // Doktorun mevcut bir AvailableDate'i var mı kontrol et
            if (!availableDateRepo.existsByDoctorIdAndAvailableDate(doctorId, date)) {
                AvailableDate entityResult = availableDateRepo.save(availableDate);
                if (entityResult != null) {
                    SingleResult<AvailableDate> result = new SingleResult<>();
                    result.setData(entityResult);
                    result.setCode(200);
                    result.setMessage("Created Successfully");
                    return result;
                }
                SingleResult<AvailableDate> result = new SingleResult<>();
                result.setCode(404);
                result.setMessage("An error occured");
                return result;
            } else {
                throw new RuntimeException("Doctor already has an available date on the selected date.");
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving available date: " + e.getMessage());
        }
    }

    //Girilen tarih aralığındaki available date'leri dönecek metot
    public boolean hasAvailableDateForDoctor(Long doctorId, LocalDate date) {
        try {
            return availableDateRepo.existsByDoctorIdAndAvailableDate(doctorId, date);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while checking available dates!");
        }
    }
    //Tüm available date'leri dönecek metot
    public ManyResult<AvailableDate> getAllAvailableDates() {
        try {
            List<AvailableDate> entityResult = availableDateRepo.findAll();
            if (entityResult != null) {
                ManyResult<AvailableDate> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<AvailableDate> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching all available dates: " + e.getMessage());
        }
    }
    //tek bir available date'i dönecek metot
    public SingleResult<AvailableDate> getAvailableDateById(long id) {
        try {
            AvailableDate entityResult = availableDateRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Available Date not found with id: " + id));
            if (entityResult != null) {
                SingleResult<AvailableDate> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            SingleResult<AvailableDate> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("Available Date not found with id:  " + id);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching available date with id: " + id + ": " + e.getMessage());
        }
    }
    //güncelleme
    public SingleResult<AvailableDate> updateAvailableDate(AvailableDate availableDate) {
        try {
            AvailableDate entityResult =availableDateRepo.save(availableDate);
            if (entityResult != null) {
                SingleResult<AvailableDate> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<AvailableDate> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occurred");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating available date: " + e.getMessage());
        }
    }
    //silme
    public void deleteAvailableDate(Long id) {
        try {
            availableDateRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while deleting available date with id: " + id + ": " + e.getMessage());
        }
    }
}