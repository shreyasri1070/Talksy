import cookie from "js-cookie";
import { useContext,createContext, useState } from "react";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const[isAuthenticated,setIsAuthenticated]=useState(false);

    const setAuthenticated=(value)=>{
           setIsAuthenticated(value);
    }

    const checkAuth=()=>{
        const token=cookie.get("authToken");
          if (token) {
      console.log("Token exists. Setting authenticated to true.");
      setAuthenticated(true);
      console.log(isAuthenticated);
    } else {
      console.log("Token does not exist. Setting authenticated to false.");
      setAuthenticated(false);
    }

    }

     const logout = () => {
    cookie.remove("authToken");
    setAuthenticated(false);
  };
return(
  <AuthContext.Provider value={{logout,checkAuth,isAuthenticated,setAuthenticated}}>
    {children}
  </AuthContext.Provider>  
)
    
}

export const useAuth = () => {
  return useContext(AuthContext);
};
