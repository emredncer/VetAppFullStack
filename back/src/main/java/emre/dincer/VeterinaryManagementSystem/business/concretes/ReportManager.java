package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IReportService;
import emre.dincer.VeterinaryManagementSystem.dao.IAppointmentRepo;
import emre.dincer.VeterinaryManagementSystem.dao.IReportRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Doctor;
import emre.dincer.VeterinaryManagementSystem.entities.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportManager implements IReportService {

    private final IReportRepo reportRepo;
    private final IAppointmentRepo appointmentRepo;

    @Autowired
    public ReportManager(IReportRepo reportRepo, IAppointmentRepo appointmentRepo) {
        this.reportRepo = reportRepo;
        this.appointmentRepo = appointmentRepo;
    }

    @Override
    public SingleResult<Report> saveReport(Report report) {
        try {
            Report savedReport = reportRepo.save(report);
            SingleResult<Report> result = new SingleResult<>();
            result.setData(savedReport);
            result.setCode(200);
            result.setMessage("Report saved Successfully");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving report: " + e.getMessage());
        }
    }

    @Override
    public ManyResult<Report> getAllReports() {
        try {
            List<Report> reports = reportRepo.findAll();
            ManyResult<Report> result = new ManyResult<>();
            result.setData(reports);
            result.setCode(200);
            result.setMessage("Reports Found Successfully");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching all reports: " + e.getMessage());
        }
    }

    @Override
    public SingleResult<Report> getReportById(Long id) {
        try {
            Report report = reportRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Report not found with id: " + id));
            SingleResult<Report> result = new SingleResult<>();
            result.setData(report);
            result.setCode(200);
            result.setMessage("Report Found Successfully");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching report with id: " + id + ": " + e.getMessage());
        }
    }

    @Override
    public SingleResult<Report> updateReport(Report report) {
        try {
            Report updatedReport = reportRepo.save(report);
            SingleResult<Report> result = new SingleResult<>();
            result.setData(updatedReport);
            result.setCode(200);
            result.setMessage("Report Updated Successfully");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating report: " + e.getMessage());
        }
    }

    @Override
    public void deleteReport(Long id) {
        try {
            reportRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while deleting report with id: " + id + ": " + e.getMessage());
        }
    }

    @Override
    public SingleResult<Report> getAppointmentsReport(Long appointmentId) {
        try {
            Appointment appointment = appointmentRepo.getById(appointmentId);
            SingleResult<Report> result = new SingleResult<>();

            if (appointment.getReport() != null) {
                // Eğer appointment'a bağlı bir report varsa, reportService kullanarak raporu alıyoruz.
                Report report = appointment.getReport();
                result.setData(report);
                result.setCode(200);
                result.setMessage("Found Successfully");
            } else {
                result.setData(null);
                result.setCode(404);
                result.setMessage("Appointment found successfully but no report is defined.");
            }

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching appointment with id: " + appointmentId + ": " + e.getMessage());
        }
    }


}
