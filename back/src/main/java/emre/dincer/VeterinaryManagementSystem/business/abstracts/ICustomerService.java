package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Customer;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ICustomerService {
    public SingleResult<Customer> saveCustomer(Customer customer);

    public ManyResult<Customer> getAllCustomers();

    public SingleResult<Customer> getCustomerById(Long id);
    public ManyResult<Customer> filterByCustomerName(String name);

    public SingleResult<Customer> updateCustomer(Customer customer);

    public void deleteCustomer(Long id);

}
