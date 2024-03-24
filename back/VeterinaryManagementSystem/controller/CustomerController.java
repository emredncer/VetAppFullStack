package emre.dincer.VeterinaryManagementSystem.controller;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.ICustomerService;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/v1/customers")
public class CustomerController {

    private final ICustomerService customerService;

    @Autowired
    public CustomerController(ICustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ManyResult<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public SingleResult<Customer> getCustomerById(@PathVariable("id") long id) {
        return customerService.getCustomerById(id);
    }

    @PostMapping
    public SingleResult<Customer> saveCustomer(@RequestBody Customer customer) {
        return customerService.saveCustomer(customer);
    }

    @PutMapping("/{id}")
    public SingleResult<Customer> updateCustomer(@PathVariable("id") long id, @RequestBody Customer customer) {
        customer.setId(id);
        return customerService.updateCustomer(customer);
    }

    @DeleteMapping("/{id}")
    public void deleteCustomer(@PathVariable("id") long id) {
        customerService.deleteCustomer(id);
    }

    @GetMapping("/filterByCustomerName/{name}")
    public ManyResult<Customer> filterCustomersByCustomerName(@PathVariable String name) {
        return customerService.filterByCustomerName(name);
    }
}