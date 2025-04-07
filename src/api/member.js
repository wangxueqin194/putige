import request from "@/utils/request";

export function getMemberList(params) {
  return request({
    url: "/employee/page",
    method: "get",
    params,
  });
}

export function enableOrDisableEmployee(params) {
  return request({
    url: "/employee",
    method: "put",
    data: { ...params },
  });
}

export function addEmployee(params) {
  return request({
    url: "/employee",
    method: "post",
    data: { ...params },
  });
}

export function editEmployee(params) {
  return request({
    url: "/employee",
    method: "put",
    data: { ...params },
  });
}

export function queryEmployeeById(id) {
  return request({
    url: `/employee/${id}`,
    method: "get",
  });
}
