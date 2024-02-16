
var admin = require("firebase-admin");

var serviceAccount = require("./.firebase/programari-online-69002-firebase-adminsdk-hpq6f-6e79969901.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programari-online-69002-default-rtdb.europe-west1.firebasedatabase.app"
});



const auth = admin.auth();

const uid = 'SAK8mVaprdYAHwplUAvdSALu38H3';

const customClaims = {
    roles: ['admin']
};

(async() => {
    await auth.setCustomUserClaims(uid, customClaims);
    const user = await auth.getUser(uid);
    console.log('success', user)
    process.exit()
})();
