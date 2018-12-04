let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();


chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET livre', () => {
    it('devrait retourner tous les livres', (done) => {
        chai.request(server)
            .get('/api/v1/livre')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.data.length.should.be.eql(0);
                done();
            });
    });
});

describe('/POST livre', () => {
    it('devrait add un livre et tous les retourner', (done) => {
        let livre = {
            titre:"titanic",
            auteur:"auteur",
            resume:"resume",
            quantite:2
          };
        chai.request(server)
            .post('/api/v1/livre')
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
    it('missing parameter on post', (done) => {
        let livre = { nom: "LE BRIS", prenom: "Jules" };
        chai.request(server)
            .post('/api/v1/livre')
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

describe('/PUT livre', () => {
    it('devrait modifier un livre et tous les retourner', (done) => {
        let livre = {
            id:1,
            titre:"titanic",
            auteur:"auteur",
            resume:"resume2",
            quantite:2
          };
        chai.request(server)
            .put('/api/v1/livre')
            .send(JSON.stringify(livre))
            .set('content-type', 'application/json')
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.success.should.be.eql(true);
                res.body.data.should.be.a("array");
                res.body.data.length.should.be.eql(1);
                res.body.data[0].resume.should.be.eql("resume2");
                done();
            });
    });
    it('missing parameter on put', (done) => {
        let livre = {
            titre:"titanic",
            auteur:"auteur",
            resume:"resume",
            quantite:2
          };
        chai.request(server)
            .put('/api/v1/livre')
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

describe('/DELETE livre', () => {
    it('devrait supprimer un livre et tous les retourner', (done) => {
        let livre = { id: 1 };
        chai.request(server)
            .delete('/api/v1/livre')
            .send(JSON.stringify(livre))
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
    it('missing parameter on delete', (done) => {
        let livre = {};
        chai.request(server)
            .delete('/api/v1/livre')
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