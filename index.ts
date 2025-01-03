import express, { Response, Request } from "express";
import dotenv from "dotenv";
import apiRoutes from "./utils/apiRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api", apiRoutes);

app.get("/test", (req: Request, res: Response) => {
	res.json({ msg: "Hi" });
});

app.listen(PORT, () => {
	console.log(new Date() + `Server is running on http://localhost:${PORT}`);
});
