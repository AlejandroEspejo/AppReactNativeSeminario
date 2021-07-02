import app from "firebase/app";
import "@firebase/auth";
import firebaseConfig from "./firebaseConfig"
class FirebaseInit {
    constructor() {
        if (!app.app.length) {
            
            app.initializeApp(firebaseConfig);
        }
    }
    getApp() {
        return app;
    }
}
var firebase = new FirebaseInit();
export default firebase;