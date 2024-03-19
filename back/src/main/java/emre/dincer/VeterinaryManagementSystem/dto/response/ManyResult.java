package emre.dincer.VeterinaryManagementSystem.dto.response;


import java.util.ArrayList;
import java.util.List;

public class ManyResult <T> extends Result{
    private List<T> data = new ArrayList<T>();

    public List<T> getData() {
        return data;
    }

    public void setData(List<T> data) {
        this.data = data;
    }
}
