package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IReportService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Doctor;
import emre.dincer.VeterinaryManagementSystem.entities.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/v1/reports")
public class ReportController {
    private final IReportService reportService;

    //DI constructor injection
    @Autowired
    public ReportController(IReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ManyResult<Report> getAllReports() {
        return reportService.getAllReports();
    }

    @GetMapping("/getAppointmentsReport/{id}")
    public SingleResult<Report> getAppointmentsReport(@PathVariable("id") long appointmentId) {
        return reportService.getAppointmentsReport(appointmentId);
    }

    @PostMapping
    public SingleResult<Report> saveReport(@RequestBody Report report) {
        return reportService.saveReport(report);
    }

    @PutMapping("/{id}")
    public SingleResult<Report> updateReport(@PathVariable("id") long id, @RequestBody Report report) {
        report.setId(id);
        return reportService.updateReport(report);
    }

    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable("id") long id) {
        reportService.deleteReport(id);
    }
}
