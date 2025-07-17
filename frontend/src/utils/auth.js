// Save JWT token
// utils/auth.js
export const saveToken = (token) => {
    localStorage.setItem("token", token.access);
};


// Get JWT token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Remove JWT token (logout)
export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
};
