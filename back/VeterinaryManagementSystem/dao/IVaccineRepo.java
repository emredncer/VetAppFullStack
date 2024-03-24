package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IVaccineRepo extends JpaRepository<Vaccine, Long> {
    List<Vaccine> findByProtectionStartDateBetween(LocalDate start, LocalDate end);
    @Query("SELECT v FROM Vaccine v WHERE v.animal.name = :animalName AND v.protectionStartDate >= :startDate AND v.protectionStartDate < :endDate AND v.protectionFinishDate <= :endDate AND v.protectionFinishDate > :startDate AND v.protectionFinishDate > v.protectionStartDate ")
    List<Vaccine> findByAnimal_NameAndProtectionStartDateAndProtectionFinishDateBetween(@Param("animalName") String animalName, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}