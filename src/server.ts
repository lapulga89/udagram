import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });

    // this endpoint accepts valid requests, it doesn't use a syntax validation, so invalid requests crash :)
    app.get("/filteredimage/", (req: Request, res: Response) => {
        let {image_url} = req.query;

        if (!image_url) {
            return res.status(400)
                .send(`Please add the mandatory parameter for the image you want to be filtered.`);
        }

        filterImageFromURL(image_url).then(imageLink => {
            return res.status(200)
                .send('Here is the link for your saved file:' + imageLink + '. Have fun!');
        }).catch(error => {
            return res.status(422)
                .send('Ooops, something went terribly wrong: ' + error)
        });


    });

    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();