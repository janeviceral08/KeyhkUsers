const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();


exports.processingNotifToUser = functions.firestore
.document('orders/{ordersId}')
.onWrite((snapshot, context) => {
  //functions.logger.log('snapshot: ', snapshot.after.data())
  //functions.logger.log('user_token: ', snapshot.after.data().user_token)
if(snapshot.after.data().OrderStatus =='Processing')
  {    admin.messaging().sendMulticast(
        {
          tokens: snapshot.after.data().user_token,
          notification:{
            title: 'Transaction is accepted!',
            body: 'Transaction no. '+snapshot.after.data().OrderNo+' is now processing',
          }
        }
      ).then((msg)=>{
        console.log('success!: ', msg)
      }).catch((err)=>
      {
        console.log('function err!: ', err)
      }
      )}

    });
