package emre.dincer.VeterinaryManagementSystem.business.abstracts;

import emre.dincer.VeterinaryManagementSystem.dto.response.ManyResult;
import emre.dincer.VeterinaryManagementSystem.dto.response.SingleResult;
import emre.dincer.VeterinaryManagementSystem.entities.AvailableDate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAvailableDateService {
    public SingleResult<AvailableDate> saveAvailableDate(AvailableDate availableDate);

    public ManyResult<AvailableDate> getAllAvailableDates();

    public SingleResult<AvailableDate> getAvailableDateById(long id);

    public SingleResult<AvailableDate> updateAvailableDate(AvailableDate availableDate);

    public void deleteAvailableDate(Long id);

}
