import { Component, OnInit } from '@angular/core';
import { Product, CreateProductDTO, UpdateProductDTO } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { da } from 'date-fns/locale';
import { zip  } from 'rxjs';
import { switchMap  } from 'rxjs/operators';
//import { error } from 'console';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  //Swal = require('sweetalert2')
  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: ''
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
/*     this.productsService.getAllProducts()
    .subscribe(data => {
      this.products = data;
    }); */
/*     this.productsService.getProductsByPAge(10, 0)
    .subscribe(data => {
      this.products = data;
    }); */
    this.loadMore();
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toogleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    //console.log('Id: ', id);
    this.statusDetail = 'loading';
    this.toogleProductDetail();
    this.productsService.getProduct(id)
    .subscribe(data => {
      //console.log('product: ', data);
      this.statusDetail = 'success';
      this.productChosen = data;
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
      //console.error(response);
    })
  }

  readAndUpdate(id: string){
    this.productsService.getProduct(id)
    //switchMap es preferible implementar en el servicio
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title: 'Cambiado'})
      //Podemos agregar tantos switchMap
      //como sean necesarios
      )
    )
    .subscribe(data => {
/*       const product = data;
      this.productsService.update(product.id, {title: 'Cambiado'})
      .subscribe(rtaUpdte => { */
        /* console.log(rtaUpdte); */
      console.log(data);
    });
/*     zip(
      //Ejecutarlos al mismo tiempo / No depende uno del otro
      this.productsService.getProduct(id),
      this.productsService.update(id, {title: 'Nuevo Cambiado'})
    ) */

    //zip es preferible implementar en el servicio
    this.productsService.fetchReadAndUpdte(id, { title: 'Nuevo Cambiado' })
    .subscribe(response => {
      const read = response[0];
      const update = response[1];
    })
  }

/*   onShowDetail(id: string) {
    this.statusDetail = 'loading';
    this.productsService.getProduct(id).subscribe({
      next: (data) => {
        this.toogleProductDetail();
        this.productChosen = data;
        this.statusDetail = 'success';
      },
      error: (errorMsg) => {
        this.statusDetail = 'error';
        this.Swal.fire({
          title: 'Error!',
          text: errorMsg,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    });
  } */

  createNeeProduct(){
    const product: CreateProductDTO = {
      price: 100,
      images: ['https://placeimg.com/640/480/any?random=${Math.random()}'],
      title: 'New Producto',
      categoryId: 1,
      description: 'Este es un nuevo Product - Angular'
    }
    this.productsService.create(product)
    .subscribe(data => {
      //console.log('Producto Nuevo', data)
      this.products.unshift(data);
    }
      );
  }

  updateteProduct(){
    const pid = this.productChosen.id;
    const changes: UpdateProductDTO = {
      title: 'New Producto',
      categoryId: 1,
      description: 'Este Product cambio desde Angular'
    }
    this.productsService.update(pid, changes)
    .subscribe(data => {
      //console.log('Producto Modificado', data)
      //this.products.unshift(data);
      const productIndex = this.products.findIndex(item => item.id === pid);
      this.products[productIndex] = data;
      this.productChosen = data;
    });
  }

  deleteProduct(){
    const pid = this.productChosen.id;
    this.productsService.delete(pid)
    .subscribe(() => {
      //console.log('Producto Modificado', data)
      const productIndex = this.products.findIndex(item => item.id === pid);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.productsService.getProductsByPAge(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    });
  }
}
