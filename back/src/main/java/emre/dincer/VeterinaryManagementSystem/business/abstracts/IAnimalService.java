package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;

import java.util.List;

public interface IAnimalService {
    public SingleResult<Animal> saveAnimal(Animal animal);

    public ManyResult<Animal> getAllAnimals();

    public SingleResult<Animal> getAnimalById(Long id);

    public SingleResult<Animal> updateAnimal(Animal animal);

    public void deleteAnimal(Long id);
    public ManyResult<Animal> filterByCustomerName(String name);


    public ManyResult<Animal> getCustomersAllAnimals(String name);

    ManyResult<Animal> filterByAnimalName(String name);
}
