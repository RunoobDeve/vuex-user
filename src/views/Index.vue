<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-button type="danger" :disabled="!ids.length" @click="delUsers">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="name" placeholder="搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table @selection-change="selChange" v-loading="loading" :data="users" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="sex" label="性别" width="180" :formatter="sexFormat"></el-table-column>
      <el-table-column prop="age" label="年龄" width="180"></el-table-column>
      <el-table-column prop="birth" label="生日" width="180"></el-table-column>
      <el-table-column prop="addr" label="地址"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150px">
        <template v-slot="{row,$index}">
          <el-button size="mini" type="primary">编辑</el-button>
          <el-button size="mini" @click="delUser(row.id,$index)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="params.page"
      background
      :page-sizes="[10, 20, 30, 40]"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ids: [],
      params: {
        page: 1,
        pagesize: 10,
        name: ""
      },
      name: ""
    };
  },
  computed: {
    users() {
      return this.$store.state.users;
    },
    loading() {
      return this.$store.state.loading;
    },
    total() {
      return this.$store.state.total;
    }
  },
  methods: {
    sexFormat(row, cellValue) {
      return cellValue ? "男" : "女";
    },
    delUser(id, index) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store
            .dispatch("delUser", {
              id,
              index
            })
            .then(
              this.$message({
                type: "success",
                message: "删除成功!"
              })
            );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    selChange(selection) {
      this.ids = selection.map(sel => {
        return sel.id;
      });
    },
    delUsers() {
      this.$confirm("是否删除这些用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("delUsers", { ids: this.ids }).then(
            this.$message({
              type: "success",
              message: "删除成功!"
            })
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    currentChange(page) {
      // console.log(page);
      this.params.page = page;
      this.$store.dispatch("getUsers", { page });
    },
    sizeChange(pagesize) {
      // console.log(pagesize);
      this.params.page = 1;
      this.params.pagesize = pagesize;
      this.$store.dispatch("getUsers", this.params);
    },
    search() {
      this.params.page = 1;
      this.params.pagesize = 10;
      this.params.name = this.name;
      this.$store.dispatch("getUsers", this.params);
    }
  },
  created() {
    this.$store.dispatch("getUsers", this.params);
  },
  watch: {
    name(val,oldval) {
      // if (!name) {
      //   this.$store.dispatch("getUsers", this.params);
      // }
      console.log(val,oldval);
    }
  }
};
</script>

<style>
</style>