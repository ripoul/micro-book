const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const baseUriLivre = '/api/v1/micro-book/livre';
const baseUriEmprunt = '/api/v1/micro-book/emprunt';
const APILivre = 'http://localhost:3001/api/v1/livre';
const APIEmprunt = 'http://localhost:3000/api/v1/emprunt';

const fetch = require('node-fetch');
global.Headers = fetch.Headers;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//get livre
app.get(baseUriLivre, (req, response) => {
    console.log("get livre");
    return request(APILivre, { json: true }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//add livre
app.post(baseUriLivre, (req, response) => {
    console.log("post livre");
    const data = { titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (!data.auteur || data.quantite == undefined || !data.resume || !data.titre) {
        return response.status(500).json({ success: false, data: 'missing parameter' });
    }
    if (data.quantite<0) {
        return response.status(500).json({ success: false, data: 'quantite must be greater or equal than 0' });
    }
    return request({ url: APILivre, method: 'POST', json: data }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//edit livre
app.put(baseUriLivre, (req, response) => {
    console.log("put livre");
    const data = { id: req.body.id, titre: req.body.titre, auteur: req.body.auteur, resume: req.body.resume, quantite: req.body.quantite };
    if (data.id == undefined || !data.auteur || data.quantite == undefined || !data.resume || !data.titre) {
        return response.status(500).json({ success: false, data: 'missing parameter' });
    }
    if (data.quantite<0) {
        return response.status(500).json({ success: false, data: 'quantite must be greater or equal than 0' });
    }
    return request({ url: APILivre, method: 'PUT', json: data }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//delete livre
app.delete(baseUriLivre, (req, response) => {
    console.log("delete livre");
    const data = { id: req.body.id };
    if (!data.id) {
        return response.status(500).json({ success: false, data: 'missing parameter' });
    }
    return request({ url: APIEmprunt, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        error = false;
        body.data.forEach(function (emprunt) {
            if (emprunt.livre_id == data.id) {
                error = true;
            }
        });
        if (error) {
            return response.status(500).json({ success: false, data: "ne peut pas suprimer un livre possedant encors des emprunts" });
        }
        return request({ url: APILivre, method: 'DELETE', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            return response.json(body);
        });
    });
});

/*##########################################################################################*/

function getLivre(livres, id) {
    ret = null;
    livres.forEach(function (element) {
        if (element.id == id) {
            ret = element;
        }
    });
    return ret;
}

function getEmprunt(emprunts, id) {
    ret = null;
    emprunts.forEach(function (element) {
        if (element.id == id) {
            ret = element;
        }
    });
    return ret;
}

//get emprunt
app.get(baseUriEmprunt, (req, response) => {
    console.log("get emprunt");
    return request(APIEmprunt, { json: true }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//get emprunt by livre
app.get(baseUriEmprunt + "/byLivre", (req, response) => {
    console.log("get emprunt by livre");
    var livre_id = req.query.livre_id;
    if (livre_id == undefined) {
        return response.status(500).json({ success: false, data: "missing parameter" });
    }
    return request({ url: APIEmprunt + "/byLivre?livre_id=" + livre_id, method: 'GET' }, (err, res, body) => {
        if (err) {
            console.log("je suis ici")
            return response.status(500).json({ success: false, data: err });
        }
        body=JSON.parse(body)
        if (!body.success) {
            console.log("je suis la")
            console.log(body);
            return response.status(500).json({ success: false, data: body.data });
        }
        return response.json(body);
    });
});

//add emprunt
app.post(baseUriEmprunt, (req, response) => {
    console.log("post emprunt");
    const data = { nom: req.body.nom, prenom: req.body.prenom, livre: req.body.livre };
    if (!data.nom || !data.prenom || data.livre == undefined) {
        return response.status(500).json({ success: false, data: 'missing parameter' });
    }
    return request({ url: APILivre, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        var livre = getLivre(body.data, data.livre);
        if (!livre) {
            return response.status(500).json({ success: false, data: 'livre inexistant' });
        }
        if (livre.quantite <= 0) {
            return response.status(500).json({ success: false, data: 'pas de ce livre en stock' });
        }
        return request({ url: APIEmprunt, method: 'POST', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            livre.quantite = livre.quantite - 1
            return request({ url: APILivre, method: 'PUT', json: livre }, (err, res, body) => {
                if (err) {
                    return response.status(500).json({ success: false, data: err });
                }
                if (!body.success) {
                    return response.status(500).json({ success: false, data: body.data });
                }
                return response.json(body);
            });
        });
    });
});

//delete emprunt
app.delete(baseUriEmprunt, (req, response) => {
    console.log("delete emprunt");
    const data = { id: req.body.id };
    if (data.id == undefined) {
        return response.status(500).json({ success: false, data: 'missing parameter' });
    }

    return request({ url: APIEmprunt, method: 'GET', json: {} }, (err, res, body) => {
        if (err) {
            return response.status(500).json({ success: false, data: err });
        }
        if (!body.success) {
            return response.status(500).json({ success: false, data: body.data });
        }
        var emprunt = getEmprunt(body.data, data.id);
        if (!emprunt) {
            return response.status(500).json({ success: false, data: 'emprunt inexistant' });
        }
        return request({ url: APILivre, method: 'GET', json: data }, (err, res, body) => {
            if (err) {
                return response.status(500).json({ success: false, data: err });
            }
            if (!body.success) {
                return response.status(500).json({ success: false, data: body.data });
            }
            var livre = getLivre(body.data, emprunt.livre_id);
            livre.quantite = livre.quantite + 1;
            return request({ url: APILivre, method: 'PUT', json: livre }, (err, res, body) => {
                if (err) {
                    return response.status(500).json({ success: false, data: err });
                }
                if (!body.success) {
                    return response.status(500).json({ success: false, data: body.data });
                }
                return request({ url: APIEmprunt, method: 'DELETE', json: { "id": emprunt.id } }, (err, res, body) => {
                    if (err) {
                        return response.status(500).json({ success: false, data: err });
                    }
                    if (!body.success) {
                        return response.status(500).json({ success: false, data: body.data });
                    }
                    return response.json(body);
                });
            });
        });
    });
});


app.listen(3002, function () {
    console.log('Example app listening on port 3002!')
})

module.exports = app;
