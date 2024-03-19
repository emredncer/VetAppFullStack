package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAppointmentService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.MergedAnnotation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/appointments")
public class AppointmentController {

    private final IAppointmentService appointmentService;

    @Autowired
    public AppointmentController(IAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ManyResult<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public SingleResult<Appointment> getAppointmentById(@PathVariable("id") Long id) {
        return  appointmentService.getAppointmentById(id);
    }

    @GetMapping("/getFilteredAppointmentsByDoctor/{doctorId}/{start}/{end}")
    public ManyResult<Appointment> getFilteredAppointmentsByDoctor(@PathVariable("doctorId") Long doctorId,
                                                                     @PathVariable("start") LocalDateTime start,
                                                                     @PathVariable("end")LocalDateTime end)  {
        return appointmentService.getDoctorsAppointmentsByDateRange(doctorId,start,end);
    }
    @GetMapping("/getFilteredAppointmentsByAnimal/{animalId}/{start}/{end}")
    public ManyResult<Appointment> getFilteredAppointmentsByAnimal(@PathVariable("animalId") Long animalId,
                                                                     @PathVariable("start") LocalDateTime start,
                                                                     @PathVariable("end")LocalDateTime end)  {
        return appointmentService.getAnimalsAppointmentsByDateRange(animalId,start,end);
    }

    @PostMapping("/save")
    public SingleResult<Appointment> saveAppointment(@RequestBody Appointment appointment) {
        return appointmentService.saveAppointment(appointment);
    }

    @PutMapping("/{id}")
    public SingleResult<Appointment> updateAppointment(@PathVariable("id") long id, @RequestBody Appointment appointment) {
        appointment.setId(id);
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable("id") long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }


}