$(function() {
  loadProducts();
  $("#products").on("click", ".delete-btn", handleDelete);
  $("#products").on("click", ".update-btn", handleUpdate);
  $("#addProductBtn").click(addProduct);
  $("#updateProductBtn").click(updateProduct);
});

function handleUpdate() {
  var btn = $(this);
  var parentRow = btn.closest("tr");
  let id = parentRow.attr("data-id");
  $.get("https://dummyjson.com/products/" + id, function(response) {
      $("#updateProductId").val(response.id);
      $("#updateProductName").val(response.title);
      $("#updateProductDescription").val(response.description);
      $("#updateProductPrice").val(response.price);
      $("#updateModal").modal("show");
  });
}

function addProduct() {
  var name = $("#productName").val();
  var description = $("#productDescription").val();
  var price = $("#productPrice").val();
  
  $.ajax({
      url: "https://dummyjson.com/products/add",
      method: "POST",
      data: { name, description, price },
      success: function(response) {
          console.log(response);
          $("#productName").val("");
          $("#productDescription").val("");
          $("#productPrice").val("");
          loadProducts();
          $("#addModal").modal("hide");
      }
  });
}

function updateProduct() {
  var id = $("#updateProductId").val();
  var title = $("#updateProductName").val();
  var description = $("#updateProductDescription").val();
  var price = $("#updateProductPrice").val();
  $.ajax({
      url: "https://dummyjson.com/products/" + id,
      data: { title, description, price },
      method: "PUT",
      success: function(response) {
          console.log("Update Product", response);
          loadProducts();
          $("#updateModal").modal("hide");
      }
  });
}

function handleDelete() {
  var btn = $(this);
  var parentRow = btn.closest("tr");
  let id = parentRow.attr("data-id");
  console.log("Deleting Product # ",id);
  $.ajax({
      url: "https://dummyjson.com/products/" + id,
      method: "DELETE",
      success: function() {
          loadProducts();
      }
  });
}

function loadProducts() {
  console.log("Loading products...");
  var productsTableBody = $("#products");
  console.log("Table body:", productsTableBody);

  $.ajax({
      url: "https://dummyjson.com/products",
      method: "GET",
      error: function(response) {
          console.error("Error loading products:", response);
          productsTableBody.html("An Error has occurred");
      },
      success: function(response) {
          console.log("Products loaded:", response);
          productsTableBody.empty();
          
          var products = response.products;
          
          if (Array.isArray(products)) {
              for (var i = 0; i < products.length; i++) {
                  var product = products[i];
                  
                  productsTableBody.append(`
                      <tr data-id="${product.id}">
                          <td>${product.title}</td>
                          <td>${product.description}</td>
                          <td>$${product.price}</td>
                          <td>
                              <button class="btn btn-danger btn-sm delete-btn">
                                  Delete
                              </button>
                              <button class="btn btn-warning btn-sm update-btn">
                                  Edit
                              </button>
                          </td>
                      </tr>
                  `);
              }
          } else {
              console.error("No products found in response.");
          }
      }
  });
}