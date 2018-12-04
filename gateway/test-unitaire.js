let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();


chai.use(chaiHttp);

/*
* Test /GET route LIVRE
*/
describe('/GET livre', () => {
    it('devrait retourner tous les livres', (done) => {
        chai.request(server)
            .get('/api/v1/micro-book/livre')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
});

/*
* Test /GET route EMPRUNT
*/
describe('/GET emprunt', () => {
    it('devrait retourner tous les emprunts', (done) => {
        chai.request(server)
            .get('/api/v1/micro-book/emprunt')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
});

/*
* Test /POST route LIVRE
*/
describe('/POST livre', () => {
    it('devrait add un livre et tous les retourner', (done) => {
        let livre = { titre: "Mein Lebendd", auteur:"Nietzsche", resume: "résumé du livre", quantite:1 };
        chai.request(server)
            .post('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                done();
            });
    });
    it('missing parameter', (done) => {
        let livre = { titre: "Mein Leben", auteur:"Nietzsche", quantite:1 };
        chai.request(server)
            .post('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

/*
* Test /POST route EMPRUNT
*/
describe('/POST emprunt', () => {
    it('devrait add un emprunt et tous les retourner', (done) => {
        let emprunt = { nom: "LE BRIS", prenom: "Jules", livre: 1 };
        chai.request(server)
            .post('/api/v1/micro-book/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                done();
            });
    });
    it('missing parameter', (done) => {
        let emprunt = { nom: "LE BRIS", prenom: "Jules" };
        chai.request(server)
            .post('/api/v1/micro-book/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

/*
* Test /PUT route LIVRE
*/
describe('/PUT livre', () => {
    it('devrait modifier un livre et tous les retourner', (done) => {
        let livre = {id:1, titre: "Aus meinem Leben", auteur :"Nietzsche", resume: "résumé du livre", quantite:1 };
        chai.request(server)
            .put('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                res.body.data[0].titre.should.be.eql("Aus meinem Leben");
                done();
            });
    });
    it('missing parameter', (done) => {
        let livre = {titre: "Aus meinem Leben", auteur: "Nietzsche", resume: "résumé du livre", quantite:1 };
        chai.request(server)
            .put('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

/*
* Test /DELETE route LIVRE
*/
describe('/DELETE livre', () => {
    it('ne peut pas suprimer de livre possédant encore un emprunt', (done) => {
        let livre = { id: 1 };
        chai.request(server)
            .delete('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                done();
            });
    });
    it('missing parameter', (done) => {
        let livre = {};
        chai.request(server)
            .delete('/api/v1/micro-book/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});

/*
* Test /DELETE route EMPRUNT
*/
describe('/DELETE emprunt', () => {
    it('devrait supprimer un emprunt et tous les retourner', (done) => {
        let emprunt = { id: 1 };
        chai.request(server)
            .delete('/api/v1/micro-book/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
    it('missing parameter', (done) => {
        let emprunt = {};
        chai.request(server)
            .delete('/api/v1/micro-book/emprunt')
            .send(JSON.stringify(emprunt))
            .set('content-type', 'application/json')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(false);
                done();
            });
    });
});
