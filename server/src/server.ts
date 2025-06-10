import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import path from 'path';
import { ENVIRONMENT, PORT, CLIENT_URL, DOCKER } from './stores/configStore';
import connectionRoutes from './routes/connectionRoutes';
import managementRoutes from './routes/managementRoutes';
import navigationRoutes from './routes/navigationRoutes';
import { maintenanceService } from "./services/maintenanceService";

const app = express();

// CORS configuration options
const corsOptions = {
  origin: CLIENT_URL,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: 'Too many requests, please try again later'
});

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

// Serve the client's static files
app.use('/', express.static(path.join(__dirname, '../static')));

// Force HTTPS redirection and CSP in production
if (ENVIRONMENT === 'production') {
  app.use((req: any, res: any, next: any) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });

  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'script-src': ['\'self\''],
        'img-src': ['\'self\'', 'data:'],
        'connect-src': ['\'self\'']
      }
    })
  );
} else {
  // Disable CSP for non-prod
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
}

// Routes
app.use(navigationRoutes);
app.use(managementRoutes);
app.use(connectionRoutes);

// Periodically run the maintenance service
// Which is: Resend the last rumor and clean up inactive party lines
setInterval(() => {
  maintenanceService();
}, 30000);

// Start the server
app.listen(PORT, () => {
  console.log(`Rumor Party Line`);
  console.log(`Internally running on http://localhost:${PORT} in ${ENVIRONMENT} mode.`);
  if (DOCKER) {
    console.log(`You're running on Docker!\n↳ Check your external port in the compose file to avoid confusion!`);
  }
});