package emre.dincer.VeterinaryManagementSystem.dao;

import emre.dincer.VeterinaryManagementSystem.entities.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IDoctorRepo extends JpaRepository<Doctor,Long> {
    boolean existsByMail(String mail);

}
