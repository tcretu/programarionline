
var admin = require("firebase-admin");

var serviceAccount = require("./.firebase/programari-online-69002-firebase-adminsdk-hpq6f-6e79969901.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programari-online-69002-default-rtdb.europe-west1.firebasedatabase.app"
});



const auth = admin.auth();

const admin_users = ['2000cretueugen@gmail.com', 'johndoe@gmail.com'];

const customClaims = {
    roles: []
};
const customClaimsAdmin = {
    roles: ['admin']
};


const listAllUsers = (nextPageToken) => {
  // List batch of users, 1000 at a time.
  auth
    .listUsers(1000, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {

			if(admin_users.includes(userRecord.email)){
				(async() => {
					auth.setCustomUserClaims(userRecord.uid, customClaimsAdmin);
					const user = auth.getUser(userRecord.uid);
					console.log('success set admin to', userRecord.toJSON());
				})();
			}else{
					auth.setCustomUserClaims(userRecord.uid, customClaims);
					const user =  auth.getUser(userRecord.uid);
					console.log('success reset claim to', userRecord.toJSON());
			}

      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        listAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
