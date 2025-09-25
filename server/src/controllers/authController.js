import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import axios from 'axios';
import { putState, consumeState } from '../auth/pkceStore.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

let client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export function __setOAuthClient(mock){ client = mock; }

export async function googleLogin(req, res, next) {
  try {
    const { id_token } = req.body;
    if (!id_token) return res.status(400).json({ message: 'id_token required' });
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;
    let user = await User.findOne({ where: { googleSub: sub } });
    if (!user) {
      user = await User.create({ googleSub: sub, email, fullName: name });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, fullName: user.fullName, nickName: user.nickName } });
  } catch (e) { next(e); }
}

// Helper: base64url
function b64url(input){ return input.toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }

export async function getGoogleAuthUrl(req,res,next){
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri){
      const missing = [];
      if (!clientId) missing.push('GOOGLE_CLIENT_ID');
      if (!redirectUri) missing.push('GOOGLE_REDIRECT_URI');
      return res.status(500).json({ message: 'Google OAuth env missing', missing });
    }
    const verifier = b64url(crypto.randomBytes(32));
    const challenge = b64url(crypto.createHash('sha256').update(verifier).digest());
    const state = b64url(crypto.randomBytes(16));
    putState(state, verifier);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent'
    });
    res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
  } catch (e){ next(e); }
}

export async function exchangeGoogleCode(req,res,next){
  try {
    const { code, state } = req.body;
    if (!code || !state) return res.status(400).json({ message: 'code and state required' });
    const verifier = consumeState(state);
    if (!verifier) return res.status(400).json({ message: 'invalid or expired state' });
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
      code_verifier: verifier
    }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
    const { id_token } = tokenRes.data;
    if (!id_token) return res.status(502).json({ message: 'id_token missing in token response' });
    // Reuse existing login flow logic
    req.body.id_token = id_token;
    return googleLogin(req,res,next);
  } catch (e){
    if (e.response) return res.status(502).json({ message: 'token exchange failed', detail: e.response.data });
    next(e);
  }
}

export async function verifyToken(req, res, next) {
  try {
    // The auth middleware should have already verified the token and set req.user
    if (!req.user) {
      return res.status(401).json({ message: 'No user found' });
    }
    res.json({ 
      valid: true, 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        fullName: req.user.fullName, 
        nickName: req.user.nickName 
      } 
    });
  } catch (e) { 
    next(e); 
  }
}
