package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.AvailableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IAvailableDateRepo extends JpaRepository <AvailableDate,Long> {
    public List<AvailableDate> getAvailableDatesByDoctorId(Long id);
    boolean existsByDoctorIdAndAvailableDate(Long doctorId, LocalDate availableDate);

}
