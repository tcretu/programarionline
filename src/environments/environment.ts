import { firebase_secret } from "./firebase-secret";
import { emailjs_secret } from "./emailjs-secret";
export const environment = {
  production:true,
  firebase:firebase_secret,
  /*
  {
  apiKey: "********",
  authDomain: "programari-online-69002.firebaseapp.com",
  databaseURL: "https://programari-online-69002-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "programari-online-69002",
  storageBucket: "programari-online-69002.appspot.com",
  messagingSenderId: "******",
  appId: "*********"
  }
  */
  emailjs:emailjs_secret,
  /*
  {
  serviceId:'*************',
  publicKey:'*************',
  templateIdConfirmareProgramare:'*************',
  templateIdAnulareProgramare:'*************',
  templateIdConfirmareInregistrare:'***********',
  templateIdSchimbareParola:'****************'
  }
  */
  notification_timeout:3000,
  app: {
    name:'Programari online',
    version:'1.0.0',
    released:new Date(2024,1,4,15,0,0),
    author:{
          name:'Tudor Cretu',
          email:'tudor.cretu.2013@gmail.com',
          tel: '+40 772 219 552',
          description:'An III IE FSEGA UBB'
    },
    codeLocation:'https://github.com/tcretu/programarionline',
    hosting:'https://programari-online-69002.web.app',
    confirmation_path:'/confirma/',
    cancellation_path:'/anuleaza/'
  },
  is_local:location.host === 'localhost',
};

