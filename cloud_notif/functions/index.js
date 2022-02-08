const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();


exports.processingNotifToUser = functions.firestore
.document('orders/{ordersId}')
.onWrite((snapshot, context) => {
if(snapshot.after.data().OrderStatus =='Processing'&& snapshot.data().ProductType =='Foods'||snapshot.data().ProductType =='Transport')
  {    admin.messaging().sendMulticast(
        {
          tokens: snapshot.after.data().user_token,
          notification:{
            title: 'Rider accepted your order!',
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
