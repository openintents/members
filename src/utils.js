export async function publicKeyFromBlockstackID(username) {
  var r = await fetch(`https://core.blockstack.org/v1/names/${username}`);
  const profile = await r.json();
  r = await fetch(`https://core.blockstack.org/v1/dids/${profile.did}`);
  const didDocument = await r.json();
  return didDocument.document.publicKey;
}

export function createMembershipCard(
  memberID,
  groupName,
  iat,
  months,
  clubPrivateKey,
  signProfileToken
) {
  const exp = new Date(
    new Date().setTime(iat.getTime() + months * 30 * 24 * 3600 * 1000)
  );
  return publicKeyFromBlockstackID(memberID).then(publicKey => {
    return {
      signedToken: signProfileToken(
        { member: true, group: groupName },
        clubPrivateKey,
        {
          username: memberID,
          publicKey: publicKey,
        },
        undefined,
        'ES256K',
        new Date(),
        exp
      ),
      exp,
    };
  });
}
