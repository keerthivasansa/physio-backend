import { createRouteGroup } from "../group";
import { getSignedUrl, uploadFile } from "$lib/storage/minio";
import { Readable } from "stream";

export const Storage = createRouteGroup({
    upload: async (req, res) => {
        const file = req.file
        if (!file)
            return res.status(400).send("missing file");
        const stream = Readable.from(file.buffer);
        const info = await uploadFile(file.originalname, "exercise", stream);
        return res.json(info);
    },
    getUrl: async (req, res) => {
        const filename = req.query['filename'].toString();
        if (filename == '')
            return res.status(400).send("missing filename");
        const signedUrl = await getSignedUrl(filename, "exercise", 60);
        res.send(signedUrl);
    }
});