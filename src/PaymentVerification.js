export function verifyReceipt(receipt) {
  const payload = receipt.payload;
  if (typeof payload === 'string') {
    throw new Error('Unexpected token payload type of string');
  }
  // Inspect and verify the subject
  if (payload.hasOwnProperty('subject')) {
    if (!payload.subject.hasOwnProperty('publicKey')) {
      throw new Error("Token doesn't have a subject public key");
    }
  } else {
    throw new Error("Token doesn't have a subject");
  }
  // Inspect and verify the issuer
  if (payload.hasOwnProperty('issuer')) {
    if (!payload.issuer.hasOwnProperty('publicKey')) {
      throw new Error("Token doesn't have an issuer public key");
    }
  } else {
    throw new Error("Token doesn't have an issuer");
  }
  // Inspect and verify the claim
  if (!payload.hasOwnProperty('claim')) {
    throw new Error("Token doesn't have a claim");
  }
  const issuerPublicKey = payload.issuer.publicKey;
}
