import app from "./src/App.js";
import connectDB from "./src/config/db.js";
import "dotenv/config";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
