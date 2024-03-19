package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentRepo extends JpaRepository<Appointment,Long> {
    public boolean existsByDoctorIdAndAppointmentStartDate(Long doctorId, LocalDateTime appointmentStartDate);
    List<Appointment> findByDoctorIdAndAppointmentStartDateBetween(Long doctorId, LocalDateTime startDate, LocalDateTime endDate);

    List<Appointment> findByAnimalIdAndAppointmentStartDateBetween(Long animalId, LocalDateTime startDate, LocalDateTime endDate);

}
