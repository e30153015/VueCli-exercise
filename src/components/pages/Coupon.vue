<template>
  <div>
    <div class="vld-parent">
      <loading :active.sync="isLoading"></loading>
    </div>
    <div class="text-right mt-4">
      <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <th>名稱</th>
        <th width="120" class="text-right">折扣百分比</th>
        <th width="120" class="text-right">到期日</th>
        <th width="100">是否啟用</th>
        <th width="120">編輯</th>
      </thead>
      <tbody v-if="coupons.length>0">
        <tr v-for="item in coupons">
          <td>{{item.title}}</td>
          <td class="text-right">{{item.percent}}%</td>
          <td class="text-right">{{item.due_date}}</td>
          <td class="text-center">
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
    <!-- <Pagination :pagination="pagination" @getPageProducts="getProducts"></Pagination> -->
    <!-- Modal -->
    <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增優惠券</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title" v-model="tempCoupon.title" placeholder="請輸入標題">
            </div>
            <div class="form-group">
              <label for="code">優惠碼</label>
              <input type="text" class="form-control" id="code" v-model="tempCoupon.code" placeholder="請輸入優惠碼">
            </div>
            <div class="form-group">
              <label for="due_date">到期日</label>
              <input type="text" class="form-control" id="due_date" v-model="tempCoupon.due_date" placeholder="請輸入到期日">
            </div>
            <div class="form-group">
              <label for="percent">折扣百分比</label>
              <input type="text" class="form-control" id="percent" v-model="tempCoupon.percent" placeholder="請輸入折扣百分比">
            </div>
            <div class="form-group">
              <div class="form-check">
                <input v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0" class="form-check-input"
                  type="checkbox" id="is_enabled">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="updateCoupon">
              <span v-if="isNew">新增優惠券</span>
              <span v-else>更改優惠券</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
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
            <strong class="text-danger">{{tempCoupon.title}}</strong> 商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger" @click="deleteCoupon(tempCoupon.id)">確認刪除</button>
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
        coupons: [],
        pagination: {},
        tempCoupon: {},
        isNew: false,
        isLoading: false,
        status: {
          fileUploading: false
        }
      }
    },
    computed: {
      // addPercent: function (data) {
      //   return data
      // }
    },
    // components: {
    //   Pagination,
    // },
    methods: {
      getCoupon(page = 1) {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
        const vm = this;
        vm.isLoading = true;
        this.$http.get(api).then((response) => {
          console.log(response.data);
          vm.isLoading = false
          vm.coupons = response.data.coupons;
          vm.pagination = response.data.pagination;
        })
      },
      openModal(isNew, item) {
        if (isNew) {
          this.tempCoupon = {};
          this.isNew = true;
        } else {
          this.tempCoupon = Object.assign({}, item);
          this.isNew = false;
        }
        $('#couponModal').modal('show');
      },
      deleteModal(item) {
        this.tempCoupon = Object.assign({}, item);
        $('#delCouponModal').modal('show');
      },
      deleteCoupon(itemID) {
        const vm = this;
        const api =
          `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${itemID}`;
        this.$http.delete(api).then((response) => {
          $('#delCouponModal').modal('hide');
          console.log("刪除：" + JSON.stringify(response.data));
          vm.getCoupon();
        })
      },
      updateCoupon() {
        let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
        let httpMethod = 'post';
        const vm = this;
        if (!vm.isNew) {
          api =
            `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
          httpMethod = "put";
        }
        this.$http[httpMethod](api, {
          data: vm.tempCoupon
        }).then((response) => {
          console.log(response.data);
          if (response.data.success) {
            $('#couponModal').modal('hide');
            vm.getCoupon();
          } else {
            $('#couponModal').modal('hide');
            vm.getCoupon();
            console.log('add fail');
          }
        })
      },
    },
    created() {
      this.getCoupon();

    }

  }
</script>