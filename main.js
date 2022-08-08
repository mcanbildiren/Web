$(document).ready(function () {
  let productList = [];
  let count = 0;
  let isUpdateStatus = false;
  let productSaveModalContent = $("#content");
  let loadingContent = $("#loading");
  productSaveModalContent.hide();
  const productSaveModal = new bootstrap.Modal("#productSaveModal");

  $("#btnProductSaveModalShow").click(() => {
    $("#formProduct").trigger("reset");
    isUpdateStatus = false;
    $("#btnSaveOrUpdate").text("Save");
    productSaveModal.show();
    loadDropdownMenuFromUserList();
  });

  $("#btnSaveOrUpdate").click(function () {
    const id = $("#id").val();
    const name = $("#name").val();
    const price = $("#price").val();
    const color = $("#color").val();
    const isPublish = $("#isPublish").is(":checked");
    const userId = $("#dropdownMenuWithUserList").val();
    if (!isUpdateStatus) {
      const newProduct = {
        id: ++count,
        userId: userId,
        name: name,
        price: price,
        color: color,
        isPublish: isPublish,
      };
      productList.push(newProduct);
      insertRow(newProduct);
    } else {
      const productIndex = productList.findIndex((x) => x.id == id);
      productList[productIndex].name = name;
      productList[productIndex].price = price;
      productList[productIndex].color = color;
      productList[productIndex].isPublish = isPublish;
      productList[productIndex].userId = userId;
      $("#productListTable tbody").empty();
      productList.forEach((x) => {
        insertRow(x);
      });
    }
    $("#formProduct").trigger("reset");
    productSaveModal.hide();
  });

  $(document).on("click", ".btnRemove", function () {
    const id = $(this).attr("data-id");
    productList = productList.filter((x) => x.id != id);
    $(this).closest("tr").remove();
  });

  $(document).on("click", ".btnUpdate", function () {
    isUpdateStatus = true;
    $("#btnSaveOrUpdate").text("Update");
    const id = $(this).attr("data-id");
    const product = productList.find((x) => x.id == id);

    $("#id").val(product.id);
    $("#name").val(product.name);
    $("#price").val(product.price);
    $("#color").val(product.color);
    $("#isPublish").prop("checked", product.isPublish);

    var options = $("#dropdownMenuWithUserList option");
    $("#dropdownMenuWithUserList").val(product.userId);
    
    productSaveModal.show();
  });

  function insertRow(product) {
    $("#productListTable tbody").append(`
      <tr data-id='${product.id}'>
      <td>${product.id}</td>
      <td>${product.userId}</td>
      <td>${product.name}</td>
      <td>${product.price}</td>
      <td>${product.color}</td>
      <td><input type='checkbox'class='form-check-input' disabled ${
        product.isPublish ? "checked" : ""
      }></td>
      <td>
      <button class='btn btn-success btn-sm btnUpdate' data-id='${
        product.id
      }'>Update</button>
      <button class='btn btn-danger btn-sm btnRemove' data-id='${
        product.id
      }'>Remove</button>
      </td>
      
      </tr>

     `);
  }

  function loadDropdownMenuFromUserList() {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/users",
      method: "GET",
      success: function (userList) {
        $("#dropdownMenuWithUserList").empty();
        userList.forEach((item) => {
          $("#dropdownMenuWithUserList").append(
            `<option value="${item.id}">${item.username}</option>`
          );
        });
        loadingContent.hide();
        productSaveModalContent.show();
      },
      error: function (e) {},
      complete: function () {},
    });
  }
});
