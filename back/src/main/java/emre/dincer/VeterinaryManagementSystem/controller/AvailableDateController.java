package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAvailableDateService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.AvailableDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/availableDates")
public class AvailableDateController {

    private final IAvailableDateService availableDateService;

    @Autowired
    public AvailableDateController(IAvailableDateService availableDateService) {
        this.availableDateService = availableDateService;
    }

    @GetMapping
    public ManyResult<AvailableDate> getAllAvailableDates() {
        return availableDateService.getAllAvailableDates();
    }

    @GetMapping("/{id}")
    public SingleResult<AvailableDate> getAvailableDateById(@PathVariable("id") long id) {
        return availableDateService.getAvailableDateById(id);
    }

    @PostMapping
    public SingleResult<AvailableDate> saveAvailableDate(@RequestBody AvailableDate availableDate) {
        return availableDateService.saveAvailableDate(availableDate);
    }

    @PutMapping("/{id}")
    public SingleResult<AvailableDate> updateAvailableDate(@PathVariable("id") long id, @RequestBody AvailableDate availableDate) {
        availableDate.setId(id);
        return availableDateService.updateAvailableDate(availableDate);
    }


    @DeleteMapping("/{id}")
    public void deleteAvailableDate(@PathVariable("id") long id) {
        availableDateService.deleteAvailableDate(id);
    }

}