const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(idToken) {
  // console.log({ idToken });
  const ticket = await client.verifyIdToken({
    idToken, // This is the ID token
    audience: process.env.GOOGLE_CLIENT_ID, // Your Google OAuth client ID
  });

  console.log({ticket});

  const payload = ticket.getPayload(); // Extract user information

  // console.log({ payload });
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}

module.exports = { googleVerify };