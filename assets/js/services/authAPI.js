import axios from "axios";
import jwtDecode from "jwt-decode";
import { LOGIN_API } from "../config";

/**
 * Déconnexion (suppression du token du localstorag et axios)
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Requête HTTP d'auth et stockage du token dans le storage eet sur axios
 * @param {object} credentials 
 * @returns 
 */
function authenticate(credentials){
    return axios.post(LOGIN_API, credentials)
            .then(response => response.data.token)
            .then(token => {
                //Stockage du token dans le local storage
                window.localStorage.setItem("authToken", token);
                //On préviens axios qu'on a maintenant un header par defaut sur les futurs requetes http
                setAxiosToken(token);
            });
}

/**
 * Position le token jwt sur axios
 * @param {string} token 
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer "+ token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup(){
    //Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    //Si le token est encore valide 
    if(token){
        const {exp: expiration} = jwtDecode(token);
        if((expiration*1000) > new Date().getTime()){
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est auth ou pas 
 * @returns boolean
 */
function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    //Si le token est encore valide 
    if(token){
        const {exp: expiration} = jwtDecode(token);
        if((expiration*1000) > new Date().getTime()){
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}