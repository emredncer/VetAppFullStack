package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.ICustomerService;
import emre.dincer.VeterinaryManagementSystem.dao.ICustomerRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerManager implements ICustomerService {
    //DI constructor injection
    private final ICustomerRepo customerRepo;

    @Autowired
    public CustomerManager(ICustomerRepo customerRepo) {
        this.customerRepo = customerRepo;
    }
    //customer kaydeden metot
    //Değerlendirme formu 10
    public SingleResult<Customer> saveCustomer(Customer customer) {
        try {
            String customerMail = customer.getMail();

            // Mail adresi bu senaryo için ayırt edici bir özellik.
            if (!customerRepo.existsByMail(customerMail)) {
                Customer entityResult = customerRepo.save(customer);
                if (entityResult != null) {
                    SingleResult<Customer> result = new SingleResult<>();
                    result.setData(entityResult);
                    result.setCode(200);
                    result.setMessage("Saved Successfully");
                    return result;
                }
                SingleResult<Customer> result = new SingleResult<>();
                result.setCode(404);
                result.setMessage("An error occured");
                return result;

            } else {
                throw new RuntimeException("A customer with the same email already exists.");
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while saving customer: " + e.getMessage());
        }
    }


    public ManyResult<Customer> getAllCustomers() {
        try {
            List<Customer> entityResult= customerRepo.findAll();
            if (entityResult != null) {
                ManyResult<Customer> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Customer> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching all customers: " + e.getMessage());
        }
    }

    public SingleResult<Customer> getCustomerById(Long id) {
        try {
            Customer entityResult = customerRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));
            if (entityResult != null) {
                SingleResult<Customer> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            SingleResult<Customer> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("Customer not found with id:  " + id);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching customer with id: " + id + ": " + e.getMessage());
        }
    }

    public SingleResult<Customer> updateCustomer(Customer customer) {
        try {
            Customer entityResult =customerRepo.save(customer);
            if (entityResult != null) {
                SingleResult<Customer> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<Customer> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occured");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating customer: " + e.getMessage());
        }
    }

    public void deleteCustomer(Long id) {
        try {
            customerRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while deleting customer with id: " + id + ": " + e.getMessage());
        }
    }
    //Customer'leri isme göre filtreleyen metot
    //Değerlendrme formu 17
    public ManyResult<Customer> filterByCustomerName(String name) {
        try {
            ManyResult<Customer> allCustomers = getAllCustomers();
            List<Customer> entityResult = new ArrayList<Customer>();

            for (Customer customer :
                    allCustomers.getData()) {
                if (customer.getName().equals(name))
                    entityResult.add(customer);
            }
            if (entityResult != null) {
                ManyResult<Customer> result = new ManyResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            ManyResult<Customer> result = new ManyResult<>();
            result.setCode(404);
            result.setMessage("Not Found!");
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}