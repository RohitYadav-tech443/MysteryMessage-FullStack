import mongoose from 'mongoose';

type ConnectionObject ={
    isConnected?:number,
}

const connection:ConnectionObject ={}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to the Database");
        return
    }

    const uri = process.env.MONGODB_URI;
    if (!uri || (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://'))) {
        console.log("❌ Invalid or missing MongoDB URI");
        throw new Error("MONGODB_URI is not valid or missing");
    }

    try {
        const db = await mongoose.connect(uri, {});
        connection.isConnected = db.connections[0].readyState
        //above lines ki madad se ham server ko database se connect karte hain
    } catch (error) {
        console.log("Database Connection failed",error);
        
        process.exit(1)
    }
}

export default dbConnect;