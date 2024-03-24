package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IAnimalService;
import emre.dincer.VeterinaryManagementSystem.dao.IAnimalRepo;
import emre.dincer.VeterinaryManagementSystem.dao.ICustomerRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnimalManager implements IAnimalService {
    //DI constructor injection
    private final IAnimalRepo animalRepo;
    private final ICustomerRepo customerRepo;

    @Autowired
    public AnimalManager(IAnimalRepo animalRepo, ICustomerRepo customerRepo) {
        this.animalRepo = animalRepo;
        this.customerRepo = customerRepo;
    }
    //Varolan bir animal kaydına izin verilmeyecek
    public boolean checkAnimalNameExists(Animal animal) {
        try {
            String animalName = animal.getName();
            List<Animal> animalsWithSameName = animalRepo.findByCustomerAndNameNotNull(animal.getCustomer());

            if (animalsWithSameName != null)
                for (Animal a : animalsWithSameName)
                    if (a.getName().equals(animalName))
                        return true; // A same name found for a customer's animal

            return false; // No animal with the same name for any customer
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    //Veri daha önceden kaydedilmediyse kayıt yapılır.
    //Değerlendirme formu 11

    public SingleResult<Animal>saveAnimal(Animal animal) {
        try {
            if (checkAnimalNameExists(animal))
                throw new RuntimeException("A similar animal already exists for this customer!"); // Existing animal found


            if (animal.getCustomer() != null)
                customerRepo.save(animal.getCustomer());

                Animal entityResult = animalRepo.save(animal);

            if (entityResult != null) {
                SingleResult<Animal> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Saved Successfully");
                return result;
            }
            SingleResult<Animal> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occured");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //tamamını getir
    public ManyResult<Animal> getAllAnimals() {
        try {
            List<Animal> entityResult = animalRepo.findAll();
            if (entityResult != null) {
                ManyResult<Animal> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Animal> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Animals not found");
        }
    }
    //bir tane getir
    public SingleResult<Animal> getAnimalById(Long id) {
        Animal entityResult = animalRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal not found with id: " + id));
        if (entityResult != null) {
            SingleResult<Animal> result = new SingleResult<>();
            result.setData(entityResult);
            result.setCode(200);
            result.setMessage("Found Successfully");
            return result;
        }
        SingleResult<Animal> result = new SingleResult<>();
        result.setCode(404);
        result.setMessage("Animal not found with id: " + id);
        return result;
    }
    //güncelleme
    public SingleResult<Animal> updateAnimal(Animal animal) {
        try {
            Animal entityResult = animalRepo.save(animal);
            if (entityResult != null) {
                SingleResult<Animal> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<Animal> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occured ");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    //silme
    public void deleteAnimal(Long id) {
        try {
            animalRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    //sahibinin adına göre hayvan filtreleme
    //değerlendirme formu 17
    @Override
    public ManyResult<Animal> filterByCustomerName(String name) {
        try {
            ManyResult<Animal> allAnimals = getAllAnimals();
            List<Animal> result = new ArrayList<Animal>();

            for (Animal animal :
                    allAnimals.getData()) {
                if (animal.getCustomer().getName().equals(name))
                    result.add(animal);
            }
            if (result != null) {
                ManyResult<Animal> dataResult = new ManyResult<>();
                dataResult.setData(result);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Animal> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    //Hayvanları isme öre filtreleme.
    //Değerlendirme formu 16
    @Override
    public ManyResult<Animal> filterByAnimalName(String name) {
        try {
            ManyResult<Animal> allAnimals = getAllAnimals();
            List<Animal> result = new ArrayList<Animal>();

            for (Animal animal :
                    allAnimals.getData()) {
                if (animal.getName().equals(name))
                    result.add(animal);
            }
            if (result != null) {
                ManyResult<Animal> dataResult = new ManyResult<>();
                dataResult.setData(result);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Animal> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Değerendirme formu 18
    @Override
    public ManyResult<Animal> getCustomersAllAnimals(String name) {
        try {
            ManyResult<Animal> allAnimals = getAllAnimals();
            List<Animal> result = new ArrayList<Animal>();

            for (Animal animal :
                    allAnimals.getData()) {
                if (animal.getName().equals(name))
                    result.add(animal);
            }
            if (result != null) {
                ManyResult<Animal> dataResult = new ManyResult<>();
                dataResult.setData(result);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Animal> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

