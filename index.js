
var admin = require("firebase-admin");

var serviceAccount = require("./.firebase/programari-online-69002-firebase-adminsdk-hpq6f-6e79969901.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programari-online-69002-default-rtdb.europe-west1.firebasedatabase.app"
});



const auth = admin.auth();

const uid = 'GbuGz7dz3BQWH2mEJcQIWH2qGIf2';

const customClaims = {
    roles: ['creator', 'provider']
};

(async() => {
    await auth.setCustomUserClaims(uid, customClaims);
    const user = await auth.getUser(uid);
    console.log('success', user)
    process.exit()
})();
