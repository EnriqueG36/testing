//Archivo para test de rutas de products

const chai = require('chai')
const supertest = require('supertest')
const userModel = require('../src/daos/model/user.model')
const cartModel = require('../src/daos/model/cart.model')
const CartManagerMongo = require('../src/daos/mongo/cart.mongo')

const expect = chai.expect
const requester = supertest('http://localhost:8080')



describe('Test para desafio complementario', ()=> {

    let pid = "645ff3031a23e826c252a5de"
    let cid
    let deletedCart

describe('Testing de router products', ()=> {


    //TEST1 debe leer todos los productos en la DB y traerlos
    it('Enpoint GET /api/products/ debe traer todos los productos en la DB', async ()=>{
        const {statusCode, _body, ok} = await requester.get('/api/products/')
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        //console.log(_body)
    })

    //TEST2 debe traer un producto por su id
    it('Enpoint GET /api/products/pid debe traer un producto en especifico', async ()=>{
        pid = "645ff3031a23e826c252a5de"

        const {statusCode, _body, ok} = await requester.get(`/api/products/${pid}`)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        expect(_body.payload._id).to.equal(pid)
        //console.log(_body)
    })

    //TEST 3 validar el funcionamiento de la ruta mockingproducts
    it('El endpoint GET api/products/mockingproducts debe generar un arreglo de 100 productos falsos', async ()=>{
        const {statusCode, _body, ok} = await requester.get('/api/products/mockingproducts/')
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        expect(_body.payload).to.be.a('array')
        expect(_body.payload).to.have.a.lengthOf(100)        
    })
})

describe('Test de router carts', ()=> {
    /*
    before(function() {
        this.cartManager = new CartManagerMongo
    })
    */
    beforeEach(function(){
        this.timeout(2000)		//Simula un delay
        })


    //TEST1 crear un carrito nuevo
    it('Endpoint POST /api/carts/ crea un nuevo carrito', async ()=> {
        const {statusCode, _body, ok} = await requester.post('/api/carts/')
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        cid = _body.payload._id
        console.log(`Carrito creado en el TEST: ${cid}`)
        
    })
    //TEST2 añadir un producto en especifico al carrito recien creado
    it('Endpoint POST /:cid/product/:pid debe añadir un producto en especifico al carrito recien creado', async ()=> {
        const {statusCode, _body, ok} = await requester.post(`/api/carts/${cid}/product/${pid}`)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        //console.log(_body)
        //expect(body.payload.products[0]._id).to.be.equal(pid)
        
    })

    //TEST3 validar que le producto exista en el carrito 
    it('Endpoint GET /:cid el producto añadido debe existir en el carrito', async ()=> {
       

        const {statusCode, _body, ok} = await requester.get(`/api/carts/${cid}/`)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        //console.log(_body)
        //console.log(_body.payload.products[0].productId)
        //console.log(_body.payload.products[0].quantity)
        expect(_body.payload.products).to.have.a.lengthOf(1)
        expect(_body.payload.products[0].productId._id).to.be.equal(pid)
        
       
    })

   //TEST4 Se debe eliminar el carrito creado
    it('Endpoint DELETE /deletecart/:cid debe eliminar el carro antes creado', async ()=>{
        const {statusCode, _body, ok} = await requester.delete(`/api/carts/deletecart/${cid}/`)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
    })
    
})

describe('Test de router session', ()=> {

    beforeEach(function(){
        this.timeout(2000)		//Simula un delay
        })


    //TEST1 debe registrar un usuario nuevo
  /*  
    it('Endpoint POST /api/session/register debe registrar un nuevo usuario', async ()=> {

        let newUserMock = {
            first_name: "Cosme",
            last_name: "Fulanito",
            email: "cosme@email.com",
            age: 80,
            password: "123456"
        }

        const {statusCode, _body, ok} = await requester.post(`/api/session/register`).send(newUserMock)
        console.log(ok)
        expect(ok).to.be.equal(true)
        expect(statusCode).to.be.equal(200)
        
    })
*/

    //TEST2 debe intentar registrar otro susuario usando el mismo correo, debe fallar el registro
    it('Endpoint POST /api/session/register debe fallar el registro de un usuario con email repetido', async()=> { 
    let newUserMock = {
        first_name: "Cosme",
        last_name: "Fulanito",
        email: "cosme@email.com",
        age: 80,
        password: "123456"
    }

    const {statusCode, _body, ok} = await requester.post(`/api/session/register`).send(newUserMock)
    //expect(ok).to.be.equal(true)
    expect(statusCode).to.be.equal(400)
    expect(_body.status).to.equal("Error")

})


    //TEST3 login de susario
    it('Endpoint POST /api/session/login debe logear al usuario recien creado', async()=> { 
        let credentialsMock = {
            email: "cosme@email.com",
            password: "123456"
        }
    
        const {statusCode, _body, ok} = await requester.post(`/api/session/login`).send(credentialsMock)
        
        expect(statusCode).to.be.equal(302)

       
    })
    /*
    //TEst 4 mostrar datos de la session actual
    it('Endpoint GET /current debe comprobar que la session del usuario está activa y que el DTO solo envíe info no sensible', async()=> { 
       
    
        const {statusCode, _body, ok} = await requester.get(`/api/session/current`)
        //expect(ok).to.be.equal(true)
        console.log(_body)
        expect(statusCode).to.be.equal(200)        
        expect(_body).to.have.property(userName)
        expect(_body).to.have.property(userMail)
        expect(_body).to.have.property(userCart)
        expect(_body).not.to.have.property(password)
    })
    */

    


})

})