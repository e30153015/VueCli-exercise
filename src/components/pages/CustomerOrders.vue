<template>
  <div>
    <loading :active.sync="isLoading"></loading>
    <div class="row mt-4">
      <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
        <div class="card border-0 shadow-sm">
          <div style="height: 150px; background-size: cover; background-position: center"
            :style="{backgroundImage:`url(${item.imageUrl})`}">
          </div>
          <div class="card-body">
            <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
            <h5 class="card-title">
              <a href="#" class="text-dark">{{item.title}}</a>
            </h5>
            <p class="card-text">{{item.content}}</p>
            <div class="d-flex justify-content-between align-items-baseline">
              <!-- <div class="h5">2,800 元</div> -->
              <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
              <del class="h6" v-if="item.price">{{item.origin_price}}</del>
              <div class="h5" v-if="item.price">{{item.price}}</div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              查看更多
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
              <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="my-5 row justify-content-center">
      <div class="my-5 row justify-content-center">
        <table class="table">
          <thead>
            <tr>
              <th></th>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carts in cartsData.carts" :key="carts.id">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(carts.id)">
                  <i class="far fa-trash-alt"></i>
                </button>
              </td>
              <td>{{carts.product.title}}</td>
              <td>{{carts.qty}}</td>
              <td>{{carts.product.price * carts.qty|| carts.product.origin_price * carts.qty}}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right">總計</td>
              <td class="text-right">{{cartsData.total}}</td>
            </tr>
            <tr v-if="cartsData.final_total !== cartsData.total">
              <td colspan="3" class="text-right text-success">折扣價</td>
              <td class="text-right text-success">{{cartsData.final_total}}</td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3 input-group-sm">
          <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼" />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多 modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!-- header -->
          <div class="modal-header bg-primary-dark">
            <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
            <button tye="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- img -->
            <img :src="product.imageUrl" class="img-fluid" alt>
            <!-- description -->
            <blockquote class="blockquote mx-3 mt-3">
              <p class="mb-0">{{ product.content }}</p>
              <footer class="blockquote-footer text-right">{{ product.description }}</footer>
            </blockquote>
            <!-- price -->
            <div class="d-flex justify-content-between align-items-baseline mx-3">
              <div class="h4" v-if="!product.price">{{ product.origin_price }} 元</div>
              <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
              <div class="h4" v-if="product.price">現在只要 {{ product.price }} 元</div>
            </div>
            <select name class="form-control mt-3" v-model="product.num" v-if="product.id">
              <option value disabled selected hidden>請選擇數量</option>
              <option :value="num" v-for="num in 10" :key="num">
                選購 {{num}} {{product.unit}}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <div class="text-muted text-nowrap mr-3">
              小計
              <strong>{{ product.num * product.price }}</strong> 元
            </div>
            <button type="button" class="btn btn-primary" @click="addtoCart(product.id,product.num)">
              <!-- <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingCartModal"></i> -->
              加到購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看更多 modal End -->
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    data() {
      return {
        products: [],
        product: {},
        cartsData: {},
        status: {
          loadingItem: '',
        },
        isLoading: false,
        coupon_code: ''
      }
    },
    methods: {
      getProducts() {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          // console.log(response.data);
          vm.isLoading = false
          vm.products = response.data.products;
        })
      },
      //取得商品詳情(查看更多)
      getProduct(id) {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
        const vm = this;
        vm.status.loadingItem = id;
        this.$http.get(api).then((response) => {
          // console.log(response);
          vm.product = response.data.product;
          $('#productModal').modal('show');
          vm.status.loadingItem = "";
        })
      },
      addtoCart(id, qty = 1) {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        const vm = this;
        vm.status.loadingItem = id;
        const cart = {
          product_id: id,
          qty
        }
        // console.log(JSON.stringify(cart))
        this.$http.post(api, {
          data: cart
        }).then((response) => {
          console.log(response);
          vm.status.loadingItem = "";
          vm.getCart();
          $('#productModal').modal('hide');
        })
      },
      getCart() {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          vm.isLoading = false;
          vm.cartsData = response.data.data;
        })
      },
      removeCartItem(id) {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.delete(api).then((response) => {
          vm.getCart();
          vm.isLoading = false;
        })
      },
      addCouponCode() {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
        const vm = this;
        console.log(vm.coupon_code)
        const coupon = {
          code: vm.coupon_code
        }
        vm.isLoading = true;
        this.$http.post(api, {
          data: coupon
        }).then((response) => {
          console.log(response.data)
          vm.getCart();
          vm.isLoading = false;
        })
      }
    },
    created() {
      this.getProducts();
      this.getCart();
    }
  }
</script>