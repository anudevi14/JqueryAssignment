$(document).ready(function () {
    loadOrders(); // Load existing orders from local storage on page load

    // Update filter value display
    $("#filterSlider").on("input", function () {
        let filterValue = parseInt($(this).val());
        $("#filterValue").text(filterValue);
        filterOrders(filterValue);
    });

    // Function to filter orders based on value
    function filterOrders(value) {
        $("#orderTable tr").each(function () {
            let orderValueText = $(this).find("td:nth-child(2)").text().replace("$", "").trim();
            let orderValue = parseInt(orderValueText);

            if (!isNaN(orderValue) && orderValue >= value) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Function to add a new input row
    $("#addOrderBtn").click(function () {
        $(".inputRow").remove(); // Remove existing input row if any

        let newRow = `<tr class="inputRow">
                        <td><input type="text" class="form-control orderIdInput" placeholder="Order ID"></td>
                        <td><input type="text" class="form-control orderValueInput" placeholder="Order Value"></td>
                        <td><input type="text" class="form-control orderQuantityInput" placeholder="Quantity"></td>
                        <td>
                            <button class="btn btn-sm btn-success saveOrderBtn">Add</button>
                        </td>
                      </tr>`;

        $("#orderTable").prepend(newRow);
    });

    // Function to save the newly added order
    $(document).on("click", ".saveOrderBtn", function () {
        let row = $(this).closest("tr");
        let orderId = row.find(".orderIdInput").val().trim();
        let orderValue = parseFloat(row.find(".orderValueInput").val().trim());
        let orderQuantity = parseInt(row.find(".orderQuantityInput").val().trim());

        if (orderId === "" || isNaN(orderValue) || isNaN(orderQuantity) || orderValue <= 0 || orderQuantity <= 0) {
            alert("Please enter valid Order ID, Order Value, and Quantity.");
            return;
        }

        if (!isOrderIdUnique(orderId)) {
            alert("Order ID must be unique.");
            return;
        }

        let newRow = `<tr>
                        <td>${orderId}</td>
                        <td>$${orderValue.toFixed(2)}</td>
                        <td>${orderQuantity}</td>
                        <td>
                            <button class="btn btn-sm btn-primary editBtn">Edit</button>
                            <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
                        </td>
                      </tr>`;

        row.replaceWith(newRow);
        saveOrdersToLocalStorage();
    });

    // Function to delete an order
    $(document).on("click", ".deleteBtn", function () {
        $(this).closest("tr").remove();
        saveOrdersToLocalStorage();
    });

    // Function to edit an order
    $(document).on("click", ".editBtn", function () {
        let row = $(this).closest("tr");
        let orderId = row.find("td:nth-child(1)").text();
        let orderValue = row.find("td:nth-child(2)").text().replace("$", "");
        let orderQuantity = row.find("td:nth-child(3)").text();

        let editRow = `<tr class="inputRow">
                        <td><input type="text" class="form-control orderIdInput" value="${orderId}" disabled></td>
                        <td><input type="text" class="form-control orderValueInput" value="${orderValue}"></td>
                        <td><input type="text" class="form-control orderQuantityInput" value="${orderQuantity}"></td>
                        <td>
                            <button class="btn btn-sm btn-success saveOrderBtn">Save</button>
                        </td>
                      </tr>`;

        row.replaceWith(editRow);
    });

    // Function to search orders
    $("#searchBox").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        $("#orderTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Function to save orders to local storage
    function saveOrdersToLocalStorage() {
        let orders = [];
        $("#orderTable tr").each(function () {
            let orderId = $(this).find("td:nth-child(1)").text();
            let orderValue = $(this).find("td:nth-child(2)").text().replace("$", "").trim();
            let orderQuantity = $(this).find("td:nth-child(3)").text().trim();

            if (orderId && orderValue && orderQuantity) {
                orders.push({
                    id: orderId,
                    value: parseFloat(orderValue),
                    quantity: parseInt(orderQuantity),
                });
            }
        });

        localStorage.setItem("orders", JSON.stringify(orders));
    }

    // Function to load orders from local storage
    function loadOrders() {
        let savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
            let orders = JSON.parse(savedOrders);
            orders.forEach(order => {
                let newRow = `<tr>
                                <td>${order.id}</td>
                                <td>$${order.value.toFixed(2)}</td>
                                <td>${order.quantity}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary editBtn">Edit</button>
                                    <button class="btn btn-sm btn-danger deleteBtn">Delete</button>
                                </td>
                              </tr>`;
                $("#orderTable").append(newRow);
            });
        }
    }

    // Function to check if an Order ID is unique
    function isOrderIdUnique(orderId) {
        let exists = false;
        $("#orderTable tr").each(function () {
            if ($(this).find("td:first").text() === orderId) {
                exists = true;
                return false;
            }
        });
        return !exists;
    }

     // Search functionality for Order ID
    $("#searchBox").on("keyup", function () {
        let searchValue = $(this).val().toLowerCase();

        $("#orderTable tr").each(function () {
            let orderId = $(this).find("td:first").text().toLowerCase();
            $(this).toggle(orderId.indexOf(searchValue) > -1);
        });
    });
});
