let cesta = [];
let almacen = require("./almacen");//llamamos a almacén
const express = require("express");
const app = express();

app.get("/departamento/:dep", function (req, res) {
  let found = false;
  let parrafo = "";
  for (let i = 0; i < almacen.length; i++) {      //para recoger loq ue escribamos en la url
    if (almacen[i].departamento.toLowerCase() === req.params.dep) {
      found = true;
      for (let j = 0; j < almacen[i].productos.length; j++) {//tenemos que incluir otro for para poder buscar en el array segun los productos que tengamos
        parrafo += `<tr><td>${almacen[i].productos[j].nombre}</td><td>${almacen[i].productos[j].precio}</td><td>${almacen[i].productos[j].stock}</td></tr>`;
      }             //el tr y el td es para crear una tabla en html
      //si lo ponemos en variables en vez de específicos, hacemos que con 1 solo podemos recorrer todos los departamentos
      break;
    }
  }
  found
    ? res.send(`<table>${parrafo}</table>`)//si existe este departamento
    : res.send("El departamento no existe");//si no existe el departamento
});

app.get("/departamento/:dep/comprar/:producto/:cantidad", function (req, res) {
  console.log(req.params.dep, req.params.producto, req.params.cantidad);//ponemos las instrucciones en la url y asi generamos una cosa u otra segun loq ue indique el usuaio
  let dep = false;
  let prod = false;
  for (let i = 0; i < almacen.length && !dep; i++) {
    if (almacen[i].departamento.toLowerCase() === req.params.dep) {
      dep = true;
      for (let j = 0; j < almacen[i].productos.length && !prod; j++) {
        if (almacen[i].productos[j].nombre === req.params.productoas) {
          prod = true;//lo cambiamos a true pero solo si esta el producto sino es false
          if (almacen[i].productos[j].stock >= req.params.cantidad) {
            cesta.push({//lo incluimos en la cesta
              producto: almacen[i].productos[j].nombre,//el objeto que le pasamos a cesta
              cantidad: req.params.cantidad,
              precio: almacen[i].productos[j].precio,
            });
            almacen[i].productos[j].stock -= req.params.cantidad;//quitamos la cantidad al stock que tengamos
            res.send(cesta);
            break;
          } else {
            res.send("No hay stock suficiente");
            break;
          }
        }
      }
    }
  }
  if (!dep) {//lo niega
    res.send("Departamento no encontrado");
  }
  if (!prod) {//lo niega
    res.send("Producto no encontrado");
  }
});

app.get("/cesta", function (req, res) {
  let parrafo = "";
  for (let i = 0; i < cesta.length; i++) {
    parrafo += `<tr><td>${cesta[i].producto}</td><td>${//mostrarlo
      cesta[i].cantidad
    }</td><td>${cesta[i].cantidad * cesta[i].precio}€</td></tr>`;//multiplicar el precio por la cantidad
  }
  res.send(`<table>${parrafo}</table>`);
});

app.get("/pagar", function (req, res) {//parametro indicado al realizar lo anterior
  cesta = [];
  res.send("La compra ha sido realizada");
});

app.listen(3000);