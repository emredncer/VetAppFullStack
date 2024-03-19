package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IVaccineRepo extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByProtectionStartDateBetween(LocalDate start, LocalDate end);
}