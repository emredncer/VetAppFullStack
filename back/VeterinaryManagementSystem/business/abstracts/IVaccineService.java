package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Vaccine;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IVaccineService {
    public SingleResult<Vaccine> saveVaccine(Vaccine vaccine);

    public ManyResult<Vaccine> getAllVaccines();
    public ManyResult<Vaccine> getAnimalsAllVaccines(Long animalId);
    public ManyResult<Vaccine> getVaccinesWithProtectionEndDateInRange(LocalDate startDate, LocalDate endDate);

    public SingleResult<Vaccine> getVaccineById(Long id);
    public ManyResult<Vaccine>getAnimalsVaccinesByDateRange(LocalDate start, LocalDate end);
    public ManyResult<Vaccine>getAnimalsVaccinesByDateRange(String animalName, LocalDate start, LocalDate end);

    public SingleResult<Vaccine> updateVaccine(Vaccine vaccine);

    public void deleteVaccine(Long id);

}
