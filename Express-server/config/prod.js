export default {
    dbURL: process.env.MONGO_URL || 'mongodb+srv://DariaRosen:<db_password>@cluster0.3prj10p.mongodb.net/',
    dbName: process.env.DB_NAME || 'MissBugs'
}
