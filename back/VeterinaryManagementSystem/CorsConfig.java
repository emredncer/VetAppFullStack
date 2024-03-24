package emre.dincer.VeterinaryManagementSystem;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins("https://vet-app-front.vercel.app/", "http://localhost:3000/")
                .allowedMethods("GET","POST","PUT","DELETE", "PATCH")
                .allowCredentials(true);
    }
}
