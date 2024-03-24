package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentRepo extends JpaRepository<Appointment,Long> {
    public boolean existsByDoctorIdAndAppointmentStartDate(Long doctorId, LocalDateTime appointmentStartDate);
    List<Appointment> findByDoctor_NameAndAppointmentStartDateBetween(String doctorName, LocalDateTime startDate, LocalDateTime endDate);

    List<Appointment> findByAnimal_NameAndAppointmentStartDateBetween(String animalName, LocalDateTime startDate, LocalDateTime endDate);

}
