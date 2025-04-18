import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       meta: { title: 'Dashboard', icon: 'dashboard' }
  //     }
  //   ]
  // },
  {
    path: "/",
    component: Layout,
    redirect: "/users",
    children: [
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/users/index"),
        meta: { title: "员工管理", icon: "member" },
      },
      {
        path: "createUser",
        name: "createUser",
        component: () => import("@/views/users/userForm"),
        meta: { title: "添加员工", icon: "member", activeMenu: "/users" },
        hidden: true,
      },
      {
        path: "editUser/:id",
        component: () => import("@/views/users/userForm"),
        name: "editUser",
        meta: { title: "编辑员工", noCache: true, activeMenu: "/users" },
        hidden: true,
      },
    ],
  },
  {
    path: "/category",
    component: Layout,
    children: [
      {
        path: "category",
        name: "Category",
        component: () => import("@/views/category/index"),
        meta: { title: "分类管理", icon: "category" },
      },
    ],
  },
  {
    path: "/menu",
    component: Layout,
    children: [
      {
        path: "menu",
        name: "Meun",
        component: () => import("@/views/food/index"),
        meta: { title: "菜品管理", icon: "food" },
      },
      {
        path: "addFood",
        component: () => import("@/views/food/foodForm"),
        name: "addFood",
        meta: { title: "添加菜品", noCache: true, activeMenu: "/menu" },
        hidden: true,
      },
      {
        path: "editFood/:id",
        component: () => import("@/views/food/foodForm"),
        name: "editFood",
        meta: { title: "修改菜品", noCache: true, activeMenu: "/menu" },
        hidden: true,
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
