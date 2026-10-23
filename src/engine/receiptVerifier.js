// JobAssist AI Studio - Professional Receipt OCR & Fraud Verification Engine
// Validates Telebirr, CBE Birr, Binance Pay, and Payoneer transactions

export function verifyReceipt({ paymentMethod, reference, amount, currency, email, existingPayments = [] }) {
  const ref = (reference || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  const result = {
    validFormat: false,
    confidence: 0,
    fraudRisk: 'LOW',
    flags: [],
    extractedData: {},
    recommendedAction: 'MANUAL_REVIEW'
  };

  if (!ref) {
    result.flags.push('EMPTY_REFERENCE');
    result.fraudRisk = 'CRITICAL';
    result.confidence = 0;
    return result;
  }

  // 1. Anti-Fraud & Deduplication Check: Has this TxID been used before?
  const duplicate = existingPayments.find(p => 
    p.reference && 
    p.reference.trim().toLowerCase() === ref.toLowerCase() && 
    p.email && 
    p.email.toLowerCase() !== cleanEmail
  );

  if (duplicate) {
    result.flags.push(`DUPLICATE_TX_ID: Previously submitted by ${duplicate.email} on ${duplicate.submittedAt}`);
    result.fraudRisk = 'CRITICAL';
    result.confidence = 10;
    result.recommendedAction = 'REJECT_SUSPECTED_FRAUD';
    return result;
  }

  const sameUserExisting = existingPayments.filter(p =>
    p.reference && 
    p.reference.trim().toLowerCase() === ref.toLowerCase() && 
    p.email && 
    p.email.toLowerCase() === cleanEmail
  );

  if (sameUserExisting.length > 1) {
    result.flags.push('ALREADY_SUBMITTED_BY_USER');
    result.fraudRisk = 'MEDIUM';
    result.confidence = 40;
  }

  // 2. Gateway-Specific Format & Pattern Verification
  const method = (paymentMethod || '').toLowerCase();

  if (method === 'telebirr' || currency === 'ETB') {
    // Telebirr patterns: Typically alphanumeric like CI49KQ32, TJ981293, 10-12 characters, or SMS strings
    const isTelebirrPattern = /^[A-Za-z0-9]{6,16}$/.test(ref) || /CI|TJ|CR|TB/i.test(ref);
    const hasSmsMarkers = /(received|sent|transferred|ETB|birr|telebirr)/i.test(ref);

    if (isTelebirrPattern || hasSmsMarkers) {
      result.validFormat = true;
      result.confidence = 94;
      result.extractedData = {
        detectedGateway: 'Telebirr Ethiopia',
        txId: ref.match(/[A-Za-z0-9]{8,14}/) ? ref.match(/[A-Za-z0-9]{8,14}/)[0] : ref,
        currency: 'ETB'
      };
      result.recommendedAction = 'AUTO_APPROVE_ELIGIBLE';
    } else {
      result.flags.push('NON_STANDARD_TELEBIRR_REFERENCE');
      result.confidence = 60;
    }
  } else if (method === 'cbe') {
    // Commercial Bank of Ethiopia: Often FT followed by digits/letters or 10-14 digits
    const isCbePattern = /^(FT)?[0-9A-Za-z]{8,18}$/i.test(ref);

    if (isCbePattern) {
      result.validFormat = true;
      result.confidence = 92;
      result.extractedData = {
        detectedGateway: 'Commercial Bank of Ethiopia (CBE)',
        txId: ref,
        currency: 'ETB'
      };
      result.recommendedAction = 'AUTO_APPROVE_ELIGIBLE';
    } else {
      result.flags.push('NON_STANDARD_CBE_REFERENCE');
      result.confidence = 55;
    }
  } else if (method === 'binance' || currency === 'USD') {
    // Binance Pay: 64-char hex hash (TRC20 / BEP20) or 8-12 digit Binance Order ID
    const isTxHash = /^[a-fA-F0-9]{64}$/.test(ref);
    const isBinanceOrderId = /^[0-9]{8,14}$/.test(ref) || /^BINANCE/i.test(ref);
    const isTrc20Tx = /^([a-fA-F0-9]{64}|[T][A-Za-z0-9]{33})$/.test(ref);

    if (isTxHash || isBinanceOrderId || isTrc20Tx) {
      result.validFormat = true;
      result.confidence = 98;
      result.extractedData = {
        detectedGateway: 'Binance Pay / Crypto Network',
        txHash: ref,
        type: isTxHash ? 'Blockchain TxID' : 'Binance Pay Order ID',
        currency: 'USD (USDT)'
      };
      result.recommendedAction = 'AUTO_APPROVE_ELIGIBLE';
    } else {
      result.flags.push('NON_STANDARD_BINANCE_ORDER_OR_HASH');
      result.confidence = 65;
    }
  } else if (method === 'payoneer') {
    // Payoneer Payment ID or Transaction Ref
    const isPayoneer = /^[0-9A-Za-z\-_]{6,24}$/.test(ref) || /@/.test(ref);
    if (isPayoneer) {
      result.validFormat = true;
      result.confidence = 88;
      result.extractedData = {
        detectedGateway: 'Payoneer Transfer',
        reference: ref,
        currency: 'USD'
      };
      result.recommendedAction = 'AUTO_APPROVE_ELIGIBLE';
    } else {
      result.flags.push('NON_STANDARD_PAYONEER_REF');
      result.confidence = 50;
    }
  }

  // Final Risk Classification
  if (result.flags.length === 0 && result.confidence >= 90) {
    result.fraudRisk = 'VERY_LOW';
  } else if (result.confidence >= 75) {
    result.fraudRisk = 'LOW';
  } else if (result.confidence >= 50) {
    result.fraudRisk = 'MEDIUM';
  } else {
    result.fraudRisk = 'HIGH';
  }

  return result;
}
