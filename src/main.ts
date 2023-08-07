import { userUrls } from "./constants/routes";
import cors from "cors";
import server from "./server";
import UserRouter from "./modules/user/routes";
import config from "../config";
import { getAuthMiddleWare } from "./middlewares/auth";

(async () => {
  /**
   * Middlewares
   */
  const authMiddleWare = getAuthMiddleWare();

  /**
   * Initiating top level app routes
   */
  const userRoutes = UserRouter(authMiddleWare);

  /**
   * Registering routes to listen incoming request
   */
  server.set("trust proxy", 1);
  server.use(cors({ credentials: true, origin: config.CLIENT_URL }));
  server.use(userUrls.root, userRoutes);

  server.use("/testAuth", authMiddleWare, (req, res) => {
    return res.status(200).send("Authenticated");
  });

  /**
   * Server
   */
  server.listen(config.PORT, () =>
    console.log(`Server is running on port ${config.PORT}`)
  );
})();
