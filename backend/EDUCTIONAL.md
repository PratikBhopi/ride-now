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
```
app.use(bodyParser.json());  // requires body-parser package
```
```
app.use(express.json());  //in built body parsing in express 4.1+
```