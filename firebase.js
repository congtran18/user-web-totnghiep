import firebase from 'firebase';

const firebaseConfig = {
	apiKey: "AIzaSyA0kHV_ecTIAeaxpMfetEr1x_P_GpZo3Rc",
	authDomain: "doantotnghiep-ed108.firebaseapp.com",
	projectId: "doantotnghiep-ed108",
	storageBucket: "doantotnghiep-ed108.appspot.com",
	messagingSenderId: "871021029921",
	appId: "1:871021029921:web:e3e75a14e3844994c15160",
	measurementId: "G-Z00RZNVM9H"
};

const app = !firebase.apps.length
	? firebase.initializeApp(firebaseConfig)
	: firebase.app();

const db = app.firestore();

export default db;
