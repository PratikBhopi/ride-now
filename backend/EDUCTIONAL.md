# CORS (CROSS ORIGIN RESOURCE SHARING)
By default, browsers enforce Same-Origin Policy, meaning a frontend running on http://localhost:3000 cannot make requests to a backend running on http://localhost:5000 . <br>
CORS is used in Node.js with Express to explicitly allow or deny cross-origin requests.
```
app.use(cors()) : this allows requests from all domains.
```
```
Allow requests only from a specific origin
app.use(cors({
    origin: "http://your-allowed-origin.com", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // If using cookies/auth headers
}));
```

# Body Parsing : 
In HTTP requests, the request body contains data sent from the client to the server, typically in POST, PUT, or PATCH requests.
However, the raw body is just a stream of bytes when it arrives at the server.<br> Body parsing is the process of reading, decoding, and converting that raw data into a usable format (like JSON or form data) for the backend application.
```javascript
app.use(bodyParser.json());  // requires body-parser package
```
```javascript
app.use(express.json());  //in built body parsing in express 4.1+
```

# Token Blacklisting
Token blacklisting is a security measure used to invalidate JWT tokens before their natural expiration time. This is particularly important for scenarios like user logout where you want to ensure the token can't be used anymore.

## Why Token Blacklisting?
- JWTs are stateless and valid until they expire
- When a user logs out, the token is still valid until expiration
- Blacklisting helps invalidate tokens immediately upon logout

## Implementation Example
1. Create a blacklist model to store invalid tokens:
```javascript
const blackListTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Auto-delete when token expires
    }
});
```

2. During logout, add token to blacklist:
```javascript
// In logout controller
const token = req.cookies.token;
const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
const expiresAt = new Date(decoded.exp * 1000);
await blackListToken.create({ token, expiresAt });
```

3. Check blacklist during authentication:
```javascript
// In auth middleware
const isBlacklisted = await blackListToken.findOne({ token: token });
if (isBlacklisted) {
    return res.status(401).json({ message: 'Unauthorized' });
}
```

The `expires` index in the schema automatically removes tokens from the blacklist once they expire, preventing database bloat.