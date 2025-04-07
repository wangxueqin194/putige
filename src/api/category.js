import request from "@/utils/request";

export function getCategoryPage(params) {
  return request({
    url: "/category/page",
    method: "get",
    params,
  });
}

export function queryCategoryById(id) {
  return request({
    url: `/category/${id}`,
    method: "get",
  });
}

export function deleCategory(id) {
  return request({
    url: "/category",
    method: "delete",
    params: { id },
  });
}

export function editCategory(params) {
  return request({
    url: "/category",
    method: "put",
    data: { ...params },
  });
}

export function addCategory(params) {
  return request({
    url: "/category",
    method: "post",
    data: { ...params },
  });
}
