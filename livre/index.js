const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const bodyParser = require('body-parser')
const app = express()
//const connectionString = 'postgresql://ripoul:Motherlode0@localhost:5432/service2';
const connectionString = 'postgresql://livre:livre@10.6.0.3:5432/livre';
const baseUri = '/api/v1/livre'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

/* insert */
app.post(baseUri, (req, res) => {
    const results = [];
    // Grab data from http request
    const data = { titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (!data.titre || !data.auteur || !data.resume || data.quantite == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    if (data.quantite<0) {
        return res.status(500).json({ success: false, data: 'il ne peut pas y avoir un nombre négatif de livre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Insert Data
        return client.query('INSERT INTO public."Livre"(titre, auteur, resume, quantite) VALUES ($1, $2, $3, $4);',
            [data.titre, data.auteur, data.resume, data.quantite], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, data: err });
                }
                // SQL Query > Select Data
                const query = client.query('SELECT * FROM public."Livre"');
                // Stream results back one row at a time
                query.on('row', (row) => {
                    results.push(row);
                });
                // After all data is returned, close connection and return results
                return query.on('end', () => {
                    done();
                    return res.json({ success: true, data: results });
                });
            });
    });
});

/* read */
app.get(baseUri, (req, res) => {
    const results = [];
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Select Data
        const query = client.query('SELECT * FROM public."Livre";');
        // Stream results back one row at a time

        query.on('error', (err) => {
            return res.status(500).json({ success: false, data: err });
        })

        query.on('row', (row) => {
            results.push(row);
        });
        // After all data is returned, close connection and return results
        return query.on('end', () => {
            done();
            return res.json({ success: true, data: results });
        });
    });
});

/* UPDATE */
app.put(baseUri, (req, res) => {
    const results = [];
    // Grab data from http request
    const data = { id: req.body.id, titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (data.id == undefined || !data.titre || !data.auteur || !data.resume || data.quantite == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    if (data.quantite<0) {
        return res.status(500).json({ success: false, data: 'il ne peut pas y avoir un nombre négatif de livre' });
    }
    // Get a Postgres client from the connection pool
    return pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Update Data
        return client.query('UPDATE public."Livre" SET titre=($1), auteur=($2), resume=($3), quantite=($4) WHERE id=($5)',
            [data.titre, data.auteur, data.resume, data.quantite, data.id], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, data: err });
                }

                // SQL Query > Select Data
                const query = client.query('SELECT * FROM public."Livre"');
                // Stream results back one row at a time
                query.on('row', (row) => {
                    results.push(row);
                });
                // After all data is returned, close connection and return results
                return query.on('end', function () {
                    done();
                    return res.json({ success: true, data: results });
                });
            });
    });
});

/* DELETE */
app.delete(baseUri, (req, res) => {
    const results = [];
    // Grab data from the URL parameters
    const id = req.body.id;
    if (id == undefined) {
        return res.status(500).json({ success: false, data: 'il manque un paramètre' });
    }
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        // Handle connection errors
        if (err) {
            done();
            return res.status(500).json({ success: false, data: err });
        }
        // SQL Query > Delete Data
        return client.query('DELETE FROM public."Livre" WHERE id=($1)', [id], (err) => {
            if (err) {
                return res.status(500).json({ success: false, data: err });
            }

            // SQL Query > Select Data
            var query = client.query('SELECT * FROM public."Livre"');
            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            return query.on('end', () => {
                done();
                return res.json({ success: true, data: results });
            });
        });
    });
});


app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})

module.exports = app;