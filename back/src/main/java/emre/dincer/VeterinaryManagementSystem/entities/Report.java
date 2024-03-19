package emre.dincer.VeterinaryManagementSystem.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import emre.dincer.VeterinaryManagementSystem.entities.Appointment;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;

    private String diagnosis;

    private double price;

    @OneToOne
    @JoinColumn (name = "appointment_id")
    private Appointment appointment;

    @OneToMany (mappedBy = "report", cascade = CascadeType.REMOVE)
    private List<Vaccine> vaccineList;

}