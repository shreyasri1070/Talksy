import api from "../Api";
export const register=(data)=>{
    try{
    const res=api.post("/user/register",data);
    return res;
    }catch(error){
        throw error;

    }
}

export const login=(data)=>{
    try {
        const res=api.post("/user/login",data);
        return res;
        
    } catch (error) {
        throw error;
    }
}

export const verifyEmail=(id,token)=>{
    try {
        const res=api.get(`/api/user/${id}/verify/${token}`);
        return res;
    } catch (error) {
        throw error;
    }

}