<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
    </div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120" class="text-right">原價</th>
        <th width="120" class="text-right">售價</th>
        <th width="100">是否啟用</th>
        <th width="120">編輯</th>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{item.category}}</td>
          <td>{{item.title}}</td>
          <td class="text-right" v-if="item.origin_price">{{item.origin_price | currency}}</td>
          <td class="text-right" v-else>0</td>
          <td class="text-right" v-if="item.price">{{item.price | currency}}</td>
          <td class="text-right" v-else>0</td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
            <button class="btn btn-outline-success btn-sm" @click="deleteModal(item)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" :class="{'disabled':!pagination.has_pre}"
          @click="getProducts(pagination.current_page - 1)">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item" v-for="page in pagination.total_pages" :key="page"
          :class="{'active':pagination.current_page === page }" @click="getProducts(page)">
          <a class="page-link" href="#">{{page}}</a>
        </li>
        <li class="page-item" :class="{'disabled':!pagination.has_next}"
          @click="getProducts(pagination.current_page + 1)">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav> -->
    <Pagination :pagination="pagination" @getPageProducts="getProducts"></Pagination>
    <!-- Modal -->
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input v-model="tempProduct.imageUrl" type="text" class="form-control" id="image" placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                </div>
                <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" v-model="tempProduct.title" placeholder="請輸入標題">
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" v-model="tempProduct.category" placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" v-model="tempProduct.unit" placeholder="請輸入單位">
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" v-model="tempProduct.origin_price" placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" v-model="tempProduct.price" placeholder="請輸入售價">
                  </div>
                </div>
                <hr>

                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" v-model="tempProduct.description" placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" v-model="tempProduct.content" placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input v-model="tempProduct.is_enabled" :true-value="1" :false-value="0" class="form-check-input" type="checkbox" id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteProduct(tempProduct.id)">確認刪除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Pagination from './Pagination'
  export default {
    data() {
      return {
        products: [],
        pagination: {},
        tempProduct: {},
        isNew: false,
        isLoading: false,
        status: {
          fileUploading: false
        }
      }
    },
    components: {
      Pagination,
    },
    methods: {
      getProducts(page = 1) {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          console.log(response.data);
          vm.isLoading = false
          vm.products = response.data.products;
          vm.pagination = response.data.pagination;
        })
      },
      openModal(isNew, item) {
        if (isNew) {
          this.tempProduct = {};
          this.isNew = true;
        } else {
          this.tempProduct = Object.assign({}, item);
          this.isNew = false;
        }
        $('#productModal').modal('show');
      },
      deleteModal(item) {
        this.tempProduct = Object.assign({}, item);
        $('#delProductModal').modal('show');
      },
      deleteProduct(itemID) {
        const vm = this;
        const api =
          `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${itemID}`;
        this.$http.delete(api).then((response) => {
          $('#delProductModal').modal('hide');
          console.log("刪除：" + JSON.stringify(response.data));
          vm.getProducts();
        })
      },
      updateProduct() {
        let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
        let httpMethod = 'post';
        const vm = this;
        if (!vm.isNew) {
          api =
            `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
          httpMethod = "put";
        }
        this.$http[httpMethod](api, {
          data: vm.tempProduct
        }).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            $('#productModal').modal('hide');
            vm.getProducts();
          } else {
            $('#productModal').modal('hide');
            vm.getProducts();
            console.log('add fail');
          }
        })
      },
      uploadFile() {
        console.log(this)
        const uploadedFile = this.$refs.files.files[0];
        const vm = this;
        vm.status.fileUploading = true;
        const formData = new FormData();
        formData.append('file-to-upload', uploadedFile);
        const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
        this.$http.post(url, formData, {
          headers: {
            'Content-Type': "multipart/form-data"
          }
        }).then((response) => {
          console.log(response.data)
          vm.status.fileUploading = false;
          if (response.data.success) {
            // vm.tempProduct.imageUrl = response.data.imageUrl;            
            // console.log(vm.tempProduct);
            vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
            console.log(vm.tempProduct);
          } else {
            this.$bus.$emit('message:push', response.data.message, 'danger')
          }
        })
      }
    },
    created() {
      this.getProducts();

    }

  }
</script>