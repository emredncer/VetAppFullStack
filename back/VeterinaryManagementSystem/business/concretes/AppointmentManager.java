package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAppointmentService;
import emre.dincer.VeterinaryManagementSystem.dao.IAppointmentRepo;
import emre.dincer.VeterinaryManagementSystem.dao.IAvailableDateRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.AvailableDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AppointmentManager implements IAppointmentService {
    //DI constructor injection
    private final IAppointmentRepo appointmentRepo;
    private final IAvailableDateRepo availableDateRepo;

    @Autowired
    public AppointmentManager(IAppointmentRepo appointmentRepo, IAvailableDateRepo availableDateRepo) {
        this.appointmentRepo = appointmentRepo;
        this.availableDateRepo = availableDateRepo;
    }

    //Doktorun müsaitliğini kontrol edecek metot
    //Değerlendirme formu 22
    private boolean isDoctorAvailable(Long id, LocalDateTime appointmentDate) {
        try {
            List<AvailableDate> availableDates = availableDateRepo.getAvailableDatesByDoctorId(id);
            List<Appointment> appointments = appointmentRepo.findAll();
            boolean isAvailable = true;
            for (AvailableDate availableDate : availableDates) {
                if (availableDate.getAvailableDate().equals(appointmentDate.toLocalDate())) {
                    for (Appointment appointment : appointments) {
                        // Doktorun o tarihte randevusu varsa, bayrağı false yap ve döngüden çık
                        if (appointment.getAppointmentStartDate().isEqual(appointmentDate) && appointment.getDoctor().getId().equals(id)) {
                            isAvailable = false;
                            break;
                        }
                    }
                }
            }
            return isAvailable;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //LocalDateTime'ı saatlere bölme
    private LocalDateTime roundHours(LocalDateTime dateTime) {
        return dateTime.truncatedTo(ChronoUnit.HOURS);
    }

    //koşullar sağlanıyorsa randevu kaydedilecek.
    //DEğerlendirme formu 14
    public SingleResult<Appointment> saveAppointment(Appointment appointment) {
        try {
            appointment.setAppointmentStartDate(roundHours(appointment.getAppointmentStartDate()));
            if (isDoctorAvailable(appointment.getDoctor().getId(), appointment.getAppointmentStartDate())) {
                appointment.setAppointmentEndDate(appointment.getAppointmentStartDate().plusHours(1));
                Appointment entityResult = appointmentRepo.save(appointment);
                if (entityResult != null) {
                    SingleResult<Appointment> result = new SingleResult<>();
                    result.setData(entityResult);
                    result.setCode(200);
                    result.setMessage("Created Successfully");
                    return result;
                }
            }
            throw new RuntimeException("Doctor doesn't work on this date!/There's another appointment scheduled for the entered time.");
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    public ManyResult<Appointment> getAllAppointments() {
        try {
            List<Appointment> entityResult = appointmentRepo.findAll();
            if (entityResult != null) {
                ManyResult<Appointment> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Appointment> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public SingleResult<Appointment> getAppointmentById(Long id) {
        Appointment entityResult = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        if (entityResult != null) {
            SingleResult<Appointment> result = new SingleResult<>();
            result.setData(entityResult);
            result.setCode(200);
            result.setMessage("Found Successfully");
            return result;
        }
        SingleResult<Appointment> result = new SingleResult<>();
        result.setCode(404);
        result.setMessage("Appointment not found with id:  " + id);
        return result;
    }

    public SingleResult<Appointment> updateAppointment(Appointment appointment) {
        try {
            Appointment entityResult = appointmentRepo.save(appointment);
            if (entityResult != null) {
                SingleResult<Appointment> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<Appointment> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteAppointment(Long id) {
        try {
            appointmentRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //doktorun girilen tarih aralığındaki randevularını filtreleme
    //Değerlendirme formu 24
    @Override
    public ManyResult<Appointment> getDoctorsAppointmentsByDateRange(String doctorName, LocalDateTime start, LocalDateTime end) {
        try {
            List<Appointment> entityResult = appointmentRepo.findByDoctor_NameAndAppointmentStartDateBetween(doctorName, start, end);
            if (entityResult != null) {
                ManyResult<Appointment> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Appointment> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Hayvanın girilen tarih aralığındaki randevularını filtreleme
    //Değerlendirme formu 23
    @Override
    public ManyResult<Appointment> getAnimalsAppointmentsByDateRange(String animalName, LocalDateTime start, LocalDateTime
            end) {
        try {
            List<Appointment> entityResult = appointmentRepo.findByAnimal_NameAndAppointmentStartDateBetween(animalName, start, end);
            if (entityResult != null) {
                ManyResult<Appointment> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Appointment> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}

