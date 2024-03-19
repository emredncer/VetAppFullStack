package emre.dincer.VeterinaryManagementSystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;


@Entity
@Table(name = "available_dates")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AvailableDate {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @NotNull
    @Column(name = "id")
    private Long id;

    @Column(name = "available_date")
    @NotNull
    private LocalDate availableDate;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "doctor_id", referencedColumnName = "id")
    private Doctor doctor;
}
