const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

app.get("/", function (req, res) {
    res.send("Response for Get request - /");
}
)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});