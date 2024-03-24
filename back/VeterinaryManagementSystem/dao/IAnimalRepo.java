package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAnimalRepo extends JpaRepository<Animal,Long> {
    List<Animal> findByCustomerName(String name);
    List<Animal>findByCustomerAndNameNotNull(Customer  customer);
}
