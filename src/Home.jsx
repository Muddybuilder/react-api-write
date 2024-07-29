import { useAuth } from "./hooks/useAuth";


export const HomePage = () => {
    const { logout,user } = useAuth();
    
    const handleLogout = () => {
      logout();
    };
    
    return (
        <>
        <h1>Hello! {user?.username}</h1>

        {user?<button onClick={handleLogout}>Log out</button>:null}
        </>
    )
}