// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: 'AIzaSyD69SYTld72FkBZAuNdNk1sLZy4DQfuTHE',
  authDomain: 'simple-feed-b6d8c.firebaseapp.com',
  databaseURL: 'https://simple-feed-b6d8c.firebaseio.com',
  projectId: 'simple-feed-b6d8c',
  storageBucket: 'simple-feed-b6d8c.appspot.com',
  messagingSenderId: '760023031930',
  appId: '1:760023031930:web:573daa84e706de808b5bc3',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'sign-in-button',
  {
    size: 'invisible',
    callback: function(response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      onSignInSubmit();
    },
  },
);

var appVerifier = window.recaptchaVerifier;

async function getMyPosts() {
  var response = await fetch('http://localhost:3000/v1/posts/mine/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'same-origin',
  });
  var json = await response.json();
  console.log(json);
}

async function signIn() {
  try {
    var phone = '+251934165381';
    var auth = await firebase.auth();
    var confirmationResult = await auth.signInWithPhoneNumber(
      phone,
      appVerifier,
    );
    var result = await confirmationResult.confirm('123456');
    window.token = result.user._lat;
    await getMyPosts();
  } catch (error) {
    console.error('Error: ', error);
  }
}
