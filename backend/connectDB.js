import sql from "mssql/msnodesqlv8.js";

async function connectDB() {
  const conn = new sql.ConnectionPool({
    connectionString:
      "Driver={ODBC Driver 18 for SQL Server};Server=MSI;Database=ChatApp;Trusted_Connection=yes;TrustServerCertificate=yes",
  });
  await conn
    .connect()
    .then(function () {
      console.log("✅ Connected database successfully");
    })
    .catch(function (err) {
      console.error("❌ Failed to connect database", err);
    });
  return conn;
}

export default connectDB;
