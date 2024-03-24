package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface IReportService {
    public SingleResult<Report> saveReport(Report report);

    public ManyResult<Report> getAllReports();

    public SingleResult<Report> getReportById(Long id);

    public SingleResult<Report> updateReport(Report report);

    public void deleteReport(Long id);

    public SingleResult<Report> getAppointmentsReport(Long appointmentId);
}
