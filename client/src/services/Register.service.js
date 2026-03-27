import api from "../Api";
export const register=async(data)=>{
    try{
    const res=await api.post("/user/register",data);
    return res;
    }catch(error){
        console.log(error)
        throw error;

    }
}

export const login=async(data)=>{
    try {
        const res=await api.post("/user/login",data);
        return res;
        
    } catch (error) {
        throw error;
    }
}

export const verifyEmail=async(id,token)=>{
    try {
        const res=await api.get(`/user/${id}/verify/${token}`);
        return res;
    } catch (error) {
        throw error;
    }

}