package emre.dincer.VeterinaryManagementSystem.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    @NotNull
    private Long id;

    @Column(name = "name")
    @NotNull
    private String name;

    @Column(name = "phone")
    @NotNull
    private String phone;

    @Column(name = "mail")
    @NotNull
    private String mail;

    @Column(name = "address",length = 200)
    @NotNull
    private String address;

    @Column(name = "city",length = 100)
    @NotNull
    private String city;

    //Bu durum için fetch LAZY mantıklı, aynı zamanda cascade type'ı da Remove verdim çünkü
    //Gereksiz veri kalmamalı.
    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JsonIgnore
    private List<Animal> animals;
}
