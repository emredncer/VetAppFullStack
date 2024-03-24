package emre.dincer.VeterinaryManagementSystem.business.concretes;

import emre.dincer.VeterinaryManagementSystem.business.abstracts.IVaccineService;
import emre.dincer.VeterinaryManagementSystem.dao.IAnimalRepo;
import emre.dincer.VeterinaryManagementSystem.dao.IVaccineRepo;
import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.Animal;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import emre.dincer.VeterinaryManagementSystem.entities.Vaccine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VaccineManager implements IVaccineService {
    //DI constructor injection
    private final IVaccineRepo vaccineRepo;
    private final IAnimalRepo animalRepo;

    @Autowired
    public VaccineManager(IVaccineRepo vaccineRepo, IAnimalRepo animalRepo) {
        this.vaccineRepo = vaccineRepo;
        this.animalRepo = animalRepo;
    }
    //koşullar kontrol edilir, uygunsa aşı kaydedilir
    //Değerlendirme formu 19
    public SingleResult<Vaccine> saveVaccine(Vaccine vaccine) {
        try {
            Optional<Animal> animal = animalRepo.findById(vaccine.getAnimal().getId());
            ManyResult<Vaccine> vaccines = getAllVaccines();
            List<Vaccine> animalsVaccines = new ArrayList<Vaccine>();
            boolean validCode = false;
            boolean validDate = false;




            for (Vaccine vaccineInList : vaccines.getData()) {
                if (vaccineInList.getAnimal().getId().equals(vaccine.getAnimal().getId())) {
                    if (vaccineInList.getCode().equals(vaccine.getCode())) {
                        if (vaccineInList.getProtectionFinishDate().isBefore(vaccine.getProtectionStartDate())) {
                            validDate = true;
                            validCode = true;
                            break;
                        } else {
                            validDate = false;
                        }
                    } else {
                        validCode = true;
                        validDate = true;
                        break;
                    }
                }

                else {
                    validDate = true;
                    validCode = true;
                }
            }

            if(vaccines.getData().isEmpty()){
                validDate = true;
                validCode = true;
            }

            if (validCode && validDate) {
                Vaccine entityResult = vaccineRepo.save(vaccine);
                if (entityResult != null) {
                    SingleResult<Vaccine> result = new SingleResult<>();
                    result.setData(entityResult);
                    result.setCode(200);
                    result.setMessage("Saved Successfully");
                    return result;
                } else {
                    SingleResult<Vaccine> result = new SingleResult<>();
                    result.setCode(404);
                    result.setMessage("An error occurred");
                    return result;
                }
            } else {
                SingleResult<Vaccine> result = new SingleResult<>();
                result.setCode(400);
                result.setMessage("Bad request");
                return result;
            }

        } catch (Exception e) {
            throw new RuntimeException("Error occurred while saving vaccine: " + e.getMessage());
        }
    }


    public ManyResult<Vaccine> getAllVaccines() {
        try {
            List<Vaccine> entityResult = vaccineRepo.findAll();
            if (entityResult != null) {
                ManyResult<Vaccine> dataResult = new ManyResult<>();
                dataResult.setData(entityResult);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Vaccine> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching all vaccines: " + e.getMessage());
        }
    }

    //Değerlendirme formu 21
    @Override
    public ManyResult<Vaccine> getAnimalsVaccinesByDateRange(LocalDate start, LocalDate end) {
        try{
            LocalDateTime startOfDay = LocalDateTime.of(start, LocalTime.MIN);
            LocalDateTime endOfDay = LocalDateTime.of(end, LocalTime.MAX);

            List<Vaccine> entityResult = vaccineRepo.findByProtectionStartDateBetween(start, end);
            if (entityResult != null) {
                ManyResult<Vaccine> dataResult = new ManyResult<>();
                dataResult.setData(entityResult);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Vaccine> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public ManyResult<Vaccine> getAnimalsVaccinesByDateRange(String animalName, LocalDate start, LocalDate end) {
        try{
            List<Vaccine> entityResult = vaccineRepo.findByAnimal_NameAndProtectionStartDateAndProtectionFinishDateBetween(animalName, start, end);
            if (entityResult != null) {
                ManyResult<Vaccine> dataResult = new ManyResult<>();
                dataResult.setData(entityResult);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Vaccine> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Hayvanın tüm aşılarını dönecek metot
    //Değerlendirme formu 20
    @Override
    public ManyResult<Vaccine> getAnimalsAllVaccines(Long animalId) {
        try {
            ManyResult<Vaccine> allVaccines = getAllVaccines();
            List<Vaccine> animalsAllVaccines = new ArrayList<Vaccine>();

            for (Vaccine vaccine :
                    allVaccines.getData()) {
                if (vaccine.getAnimal().getId() == animalId)
                    animalsAllVaccines.add(vaccine);
            }
            if (animalsAllVaccines != null) {
                ManyResult<Vaccine> dataResult = new ManyResult<>();
                dataResult.setData(animalsAllVaccines);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Vaccine> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching animals' vaccines with animal id: " + animalId + ": " + e.getMessage());
        }
    }


    public SingleResult<Vaccine> getVaccineById(Long id) {
        try {
            Vaccine entityResult = vaccineRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Vaccine not found with id: " + id));
            if (entityResult != null) {
                SingleResult<Vaccine> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Found Successfully");
                return result;
            }
            SingleResult<Vaccine> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("Vaccine not found with id:  " + id);
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching vaccine with id: " + id + ": " + e.getMessage());
        }
    }

    public SingleResult<Vaccine> updateVaccine(Vaccine vaccine) {
        try {
            Vaccine entityResult = vaccineRepo.save(vaccine);
            if (entityResult != null) {
                SingleResult<Vaccine> result = new SingleResult<>();
                result.setData(entityResult);
                result.setCode(200);
                result.setMessage("Updated Successfully");
                return result;
            }
            SingleResult<Vaccine> result = new SingleResult<>();
            result.setCode(404);
            result.setMessage("An error occurred");
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while updating vaccine: " + e.getMessage());
        }
    }

    public void deleteVaccine(Long id) {
        try {
            vaccineRepo.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while deleting vaccine with id: " + id + ": " + e.getMessage());
        }
    }

    @Override
    public ManyResult<Vaccine> getVaccinesWithProtectionEndDateInRange(LocalDate startDate, LocalDate endDate) {
        try {
            ManyResult<Vaccine> allVaccines = getAllVaccines();
            List<Vaccine> result = new ArrayList<>();

            for (Vaccine vaccine : allVaccines.getData()) {
                LocalDate protectionEndDate = vaccine.getProtectionFinishDate();

                if (protectionEndDate.isAfter(startDate) && protectionEndDate.isBefore(endDate)) {
                    result.add(vaccine);
                }
            }
            if (result != null) {
                ManyResult<Vaccine> dataResult = new ManyResult<>();
                dataResult.setData(result);
                dataResult.setCode(200);
                dataResult.setMessage("Found Successfully");
                return dataResult;
            }
            ManyResult<Vaccine> dataResult = new ManyResult<>();
            dataResult.setCode(404);
            dataResult.setMessage("Not Found!");
            return dataResult;
        } catch (Exception e) {
            throw new RuntimeException("Error occurred while fetching vaccines with protection end date in range: " + startDate + " - " + endDate + ": " + e.getMessage());
        }
    }
}