package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAnimalService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/v1/animals")
public class AnimalController {

    private final IAnimalService animalService;


    public AnimalController(IAnimalService animalService) {
        this.animalService = animalService;
    }


    @GetMapping
    public ManyResult<Animal> getAllAnimals() {
        return animalService.getAllAnimals();
    }


    @GetMapping("/{id}")
    public SingleResult<Animal> getAnimalById(@PathVariable("id") long id) {
        return animalService.getAnimalById(id);
    }


    @GetMapping("/filterByCustomerName/{name}")
    public ManyResult<Animal> filterAnimalsByCustomerName(@PathVariable String name) {
        return animalService.filterByCustomerName(name);
    }


    @GetMapping("/filterByAnimalName/{name}")
    public ManyResult<Animal> filterAnimalsByAnimalName(@PathVariable String name) {
        return animalService.filterByAnimalName(name);
    }


    @PostMapping
    public SingleResult<Animal> saveAnimal(@RequestBody Animal animal) {
        return animalService.saveAnimal(animal);
    }


    @PutMapping("/{id}")
    public SingleResult<Animal> updateAnimal(@PathVariable("id") long id, @RequestBody Animal animal) {
        animal.setId(id);
        return animalService.updateAnimal(animal);
    }


    @DeleteMapping("/{id}")
    public void  deleteAnimal(@PathVariable("id") long id) {
        animalService.deleteAnimal(id);
    }

}