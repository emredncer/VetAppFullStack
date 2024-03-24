package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IAppointmentService {
    public SingleResult<Appointment> saveAppointment(Appointment appointment);

    public ManyResult<Appointment> getAllAppointments();

    public SingleResult<Appointment> getAppointmentById(Long id);

    public SingleResult<Appointment> updateAppointment(Appointment appointment);

    public void deleteAppointment(Long id);

    public ManyResult<Appointment> getDoctorsAppointmentsByDateRange(String doctorName, LocalDateTime start, LocalDateTime end);
    public ManyResult<Appointment> getAnimalsAppointmentsByDateRange(String animalName, LocalDateTime start, LocalDateTime end);
}
