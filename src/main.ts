import { app } from "./applications/app";
import { logger } from "./applications/logging";

app.listen(3000, () => {
    logger.info(`Server is running on port 3000`);
});
