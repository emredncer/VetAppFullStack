package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface IReportRepo extends JpaRepository<Report,Long> {
    Optional<Report> findByAppointmentId(Long appointmenId);
}
