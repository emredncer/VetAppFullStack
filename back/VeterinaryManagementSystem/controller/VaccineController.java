package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IVaccineService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Vaccine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/v1/vaccines")
public class VaccineController {

    private final IVaccineService vaccineService;

    @Autowired
    public VaccineController(IVaccineService vaccineService) {
        this.vaccineService = vaccineService;
    }

    @GetMapping
    public ManyResult<Vaccine> getAllVaccines() {
       return vaccineService.getAllVaccines();
    }

    @GetMapping("/getAnimalsFilteredVaccinesByDate/{start}/{end}")
    public ManyResult<Vaccine> findByProtectionStartDateBetween(@PathVariable("start") LocalDate start,
                                                                         @PathVariable("end") LocalDate end) {
        return vaccineService.getAnimalsVaccinesByDateRange(start, end);
    }

    @GetMapping("/getAnimalsFilteredVaccinesByDate/{name}/{start}/{end}")
    public ManyResult<Vaccine> findByProtectionStartDateBetween(@PathVariable("name") String name,
                                                                @PathVariable("start") LocalDate start,
                                                                @PathVariable("end") LocalDate end) {
        return vaccineService.getAnimalsVaccinesByDateRange(name, start, end);
    }

    @GetMapping("/animalsAllVaccines/{id}")
    public ManyResult<Vaccine> getAnimalsAllVaccines(@PathVariable("id") long animalId) {
        return vaccineService.getAnimalsAllVaccines(animalId);
    }


    @GetMapping("/{id}")
    public SingleResult<Vaccine> getVaccineById(@PathVariable("id") long id) {
        return vaccineService.getVaccineById(id);
    }

    @GetMapping("/inRange/{startDate}/{endDate}")
    public ManyResult<Vaccine> getVaccinesWithProtectionEndDateInRange
            (@PathVariable("startDate") LocalDate startDate,
             @PathVariable("endDate") LocalDate endDate) {
        return vaccineService.getVaccinesWithProtectionEndDateInRange(startDate, endDate);
    }

    @PostMapping
    public SingleResult<Vaccine> saveVaccine(@RequestBody Vaccine vaccine) {
        return vaccineService.saveVaccine(vaccine);
    }

    @PutMapping("/{id}")
    public SingleResult<Vaccine> updateVaccine(@PathVariable("id") long id, @RequestBody Vaccine vaccine) {
        vaccine.setId(id);
        return vaccineService.updateVaccine(vaccine);
    }

    @DeleteMapping("/{id}")
    public void deleteVaccine(@PathVariable("id") long id) {
        vaccineService.deleteVaccine(id);
    }


}