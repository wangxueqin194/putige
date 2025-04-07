import request from "@/utils/request";

export function getDishPage(params) {
  return request({
    url: "/dish/page",
    method: "get",
    params,
  });
}

export function deleteDish(ids) {
  return request({
    url: "/dish",
    method: "delete",
    params: { ids },
  });
}

export function editDish(params) {
  return request({
    url: "/dish",
    method: "put",
    data: { ...params },
  });
}

export function addDish(params) {
  return request({
    url: "/dish",
    method: "post",
    data: { ...params },
  });
}

export function queryDishById(id) {
  return request({
    url: `/dish/${id}`,
    method: "get",
  });
}

export function getCategoryList(params) {
  return request({
    url: "/category/list",
    method: "get",
    params,
  });
}

export function queryDishList(params) {
  return request({
    url: "/dish/list",
    method: "get",
    params,
  });
}

export function commonDownload(params) {
  return request({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    url: "/common/download",
    method: "get",
    params,
  });
}

export function dishStatusByStatus(params) {
  return request({
    url: `/dish/status/${params.status}`,
    method: "post",
    params: { ids: params.id },
  });
}
