package emre.dincer.VeterinaryManagementSystem.dto.response;

public class SingleResult <T> extends  Result{
    private T data;

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}

