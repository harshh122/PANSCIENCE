import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs;
mongoose.connection.once("open", () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection("documents"); 
});

export const getFile = async (req, res) => {
    try {
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        
        const file = await gfs.files.findOne({ _id: fileId });
        if (!file) return res.status(404).json({ message: "File not found" });

        
        const readStream = gfs.createReadStream({ _id: file._id });

       
        res.set("Content-Type", file.contentType || "application/octet-stream");
        res.set(
            "Content-Disposition",
            `attachment; filename="${file.filename}"`
        );

        readStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get file" });
    }
};
