$(function () {
	"use strict";

	let token = sessionStorage.getItem("token");

	$(document).ready(function ($) {
		dataTableAlertPrevent("table");
		loadStores();
		loadCategories();
		loadBrands();
		loadProducts();

		$(".datepicker").datepicker({
			format: "yyyy-mm-dd",
			autoclose: true,
			todayHighlight: true,
			startDate: new Date(), // Disables past dates if needed
		});

		// Initialize the clock picker
		$(".timepicker").clockpicker({
			autoclose: true,
		});

		//add product
		$("#form-new-product").on("submit", function (e) {
			e.preventDefault(); //prevent default form submission event
			addProduct(); //Internal function for form submission
		});

		//update product
		$("#form-update-product").on("submit", function (e) {
			e.preventDefault();
			updateProduct();
		});

		$("#products").on("click", ".btn-delete", function () {
			var productID = $(this).attr("data-id");
			deleteProduct(productID);
		});

		$("#products").on("click", ".btn-edit", function () {
			var productID = $(this).attr("data-id");
			var editModal = $("#editModal");

			//fetch user details
			$.ajax({
				url: `${API_URL_ROOT}/products/${productID}`,
				type: "GET",
				dataType: "json",
				headers: { "x-access-token": token },
				success: function (response) {
					if (response.error == false) {
						var product = response.product;
						editModal
							.find(".modal-title")
							.text(product.product_name);
						editModal
							.find("#product_category_id1")
							.selectpicker("val", product.product_category_id);
						editModal
							.find("#product_brand_id1")
							.selectpicker("val", product.product_brand_id);
						editModal
							.find("#product_status")
							.selectpicker("val", product.product_status);
						editModal
							.find("#product_name1")
							.val(product.product_name);
						editModal
							.find("#product_cost_price1")
							.val(product.product_cost_price);
						editModal
							.find("#product_price1")
							.val(product.product_price);
						editModal
							.find("#product_stock1")
							.val(product.product_stock);
						editModal
							.find("#product_reorder_level1")
							.val(product.product_reorder_level);
						editModal
							.find("#product_vat_rate")
							.val(product.product_vat_rate);
						editModal
							.find("#product_discount_rate")
							.val(product.product_discount_rate);
						editModal
							.find("#product_measuring_units1")
							.val(product.product_measuring_units);
						editModal
							.find("#product_expiry_date1")
							.val(
								moment(product.product_expiry_date).isValid()
									? moment(
											product.product_expiry_date
									  ).format("YYYY-MM-DD")
									: ""
							);
						editModal
							.find("#product_expiry_time1")
							.val(
								moment(product.product_expiry_date).isValid()
									? moment(
											product.product_expiry_date
									  ).format("HH:MM")
									: ""
							);
						editModal
							.find("#product_expiry_discount_rate1")
							.val(product.product_expiry_discount_rate);
						editModal.find("#product_id").val(product.product_id);

						if (payloadClaim(token, "user_role") == "Super Admin") {
							editModal
								.find("#store_id1")
								.selectpicker("val", product.store_id);
						}
					} else {
						showSimpleMessage(
							"Attention",
							response.message,
							"error"
						);
					}
				},
				error: function (req, status, error) {
					showSimpleMessage(
						"Attention",
						"ERROR - " + req.status + " : " + req.statusText,
						"error"
					);
				},
			});
		});

		$("#products").on("click", ".btn-qr-scan", function () {
			var productID = $(this).attr("data-id");
			var qrModal = $("#qrModal");

			//fetch product details
			$.ajax({
				url: `${API_URL_ROOT}/products/${productID}`,
				type: "GET",
				dataType: "json",
				headers: { "x-access-token": token },
				success: function (response) {
					if (response.error == false) {
						var product = response.product;
						qrModal.find(".modal-body").empty();
						qrModal.find(".modal-title").text(product.product_name);
						var qrContent = `
                            Product Name: ${product.product_name} \n
                            Product Cost Price: ${product.product_cost_price} \n
                            Product Price: ${product.product_price} \n
                            Quantity In Stock: ${product.product_stock} \n
                            Reorder Level: ${product.product_reorder_level} \n
                            Sales Tax: ${product.product_vat_rate} % \n
                            Unit: ${product.product_measuring_units}
                        `;
						var qrcode = new QRCode("qrCode", {
							text: qrContent,
							width: 256,
							height: 256,
							colorDark: "#000000",
							colorLight: "#ffffff",
							correctLevel: QRCode.CorrectLevel.H,
						});
					} else {
						showSimpleMessage(
							"Attention",
							response.message,
							"error"
						);
					}
				},
				error: function (req, status, error) {
					showSimpleMessage(
						"Attention",
						"ERROR - " + req.status + " : " + req.statusText,
						"error"
					);
				},
			});
		});

		$("#filter").on("submit", function (e) {
			e.preventDefault();

			var form = $(this);
			var storeID =
				payloadClaim(token, "user_role") == "Admin"
					? payloadClaim(token, "user_store_id")
					: form.find("#store_id2").val();
			var categoryID = form.find("#product_category_id2").val();
			var brandID = form.find("#product_brand_id2").val();
			var status = form.find("#product_status1").val();
			var fields = form.find("input.required, select.required");

			for (var i = 0; i < fields.length; i++) {
				if (fields[i].value == "") {
					/*alert(fields[i].id)*/
					//unblockUI();
					$("#" + fields[i].id).focus();
					showSimpleMessage(
						"Attention",
						`${fields[i].name} is required`,
						"error"
					);
					return false;
				}
			}

			loadProducts(storeID, categoryID, brandID, status);
		});
	});

	//internal function to add new product
	function addProduct() {
		swal({
			title: "Attention",
			text: "Are you sure you want to add this product?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes!",
			cancelButtonText: "No!",
		}).then(function (result) {
			if (result.value) {
				//name vairables
				var form = $("#form-new-product"); //form
				var table = $("#products").DataTable();
				var fields = form.find("input.required, select.required");

				blockUI();

				for (var i = 0; i < fields.length; i++) {
					if (fields[i].value == "") {
						/*alert(fields[i].id)*/
						unblockUI();
						$("#" + fields[i].id).focus();
						showSimpleMessage(
							"Attention",
							`${fields[i].name} is required`,
							"error"
						);
						return false;
					}
				}

				$.ajax({
					type: "POST",
					url: `${API_URL_ROOT}/products`,
					data: JSON.stringify(form.serializeObject()),
					dataType: "json",
					contentType: "application/json",
					headers: { "x-access-token": token },
					success: function (response) {
						if (response.error == false) {
							unblockUI();
							showSimpleMessage(
								"Success",
								response.message,
								"success"
							);
							form.get(0).reset();
							$(".selectpicker").selectpicker("val", "");
							table.ajax.reload(null, false);
						} else {
							unblockUI();
							showSimpleMessage(
								"Attention",
								response.message,
								"error"
							);
						}
					},
					error: function (req, status, error) {
						unblockUI();
						showSimpleMessage(
							"Attention",
							"ERROR - " + req.status + " : " + req.responseText,
							"error"
						);
					},
				});
			} else {
				showSimpleMessage("Canceled", "Process Abborted", "error");
			}
		});
	}

	//internal function to update product
	function updateProduct() {
		swal({
			title: "Attention",
			text: "Are you sure you want to update this product?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes!",
			cancelButtonText: "No!",
			/*closeOnConfirm: false,
            closeOnCancel: false*/
		}).then(function (result) {
			if (result.value) {
				//name vairables
				var form = $("#form-update-product"); //form
				var productID = form.find("#product_id").val();
				var table = $("#products").DataTable();
				var fields = form.find("input.required, select.required");

				blockUI();

				for (var i = 0; i < fields.length; i++) {
					if (fields[i].value == "") {
						/*alert(fields[i].id);*/
						unblockUI();
						$("#" + fields[i].id).focus();
						showSimpleMessage(
							"Attention",
							`${fields[i].name} is required`,
							"error"
						);
						return false;
					}
				}

				$.ajax({
					type: "PUT",
					url: `${API_URL_ROOT}/products/${productID}`,
					data: JSON.stringify(form.serializeObject()),
					dataType: "json",
					contentType: "application/json",
					headers: { "x-access-token": token },
					success: function (response) {
						if (response.error == false) {
							unblockUI();
							showSimpleMessage(
								"Success",
								response.message,
								"success"
							);
							$("#editModal").find(".close").click();
							table.ajax.reload(null, false);
						} else {
							unblockUI();
							showSimpleMessage(
								"Attention",
								response.message,
								"error"
							);
						}
					},
					error: function (req, status, error) {
						unblockUI();
						showSimpleMessage(
							"Attention",
							"ERROR - " + req.status + " : " + req.responseText,
							"error"
						);
					},
				});
			} else {
				showSimpleMessage("Canceled", "Process Abborted", "error");
			}
		});
	}

	//internal function to delete a product
	function deleteProduct(productID) {
		swal({
			title: "Attention",
			text: "Are you sure you want to delete this product?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes!",
			cancelButtonText: "No!",
			/*closeOnConfirm: false,
            closeOnCancel: false*/
		}).then(function (result) {
			if (result.value) {
				//name vairables
				var table = $("#products");
				var rowCount = table.find("tbody tr").length;

				blockUI();

				$.ajax({
					type: "DELETE",
					url: `${API_URL_ROOT}/products/${productID}`,
					dataType: "json",
					headers: { "x-access-token": token },
					success: function (response) {
						if (response.error == false) {
							unblockUI();
							showSimpleMessage(
								"Success",
								response.message,
								"success"
							);
							table.DataTable().ajax.reload(null, false);
						} else {
							unblockUI();
							showSimpleMessage(
								"Attention",
								response.message,
								"error"
							);
						}
					},
					error: function (req, status, error) {
						unblockUI();
						showSimpleMessage(
							"Attention",
							"ERROR - " + req.status + " : " + req.statusText,
							"error"
						);
					},
				});
			} else {
				showSimpleMessage("Canceled", "Process Abborted", "error");
			}
		});
	}

	//load products
	function loadProducts(
		storeID = "",
		categoryID = "",
		brandID = "",
		status = ""
	) {
		var table = $("#products");

		var storeID =
			payloadClaim(token, "user_role") == "Admin"
				? payloadClaim(token, "user_store_id")
				: storeID;

		table.DataTable({
			oLanguage: {
				oPaginate: {
					sPrevious:
						'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
					sNext: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
				},
				sInfo: "Showing page _PAGE_ of _PAGES_",
				sSearch:
					'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
				sSearchPlaceholder: "Search...",
				sLengthMenu: "Results :  _MENU_",
			},
			lengthMenu: [7, 10, 20, 50, 100],
			stripeClasses: [],
			drawCallback: function () {
				$(".dataTables_paginate > .pagination").addClass(
					" pagination-style-13 pagination-bordered mb-5"
				);
			},
			language: {
				infoEmpty:
					"<span style='color:red'><b>No records found</b></span>",
			},
			processing: true,
			serverSide: true,
			destroy: true,
			autoWidth: false,
			pageLength: 100,
			ajax: {
				type: "GET",
				url: `${API_URL_ROOT}/products/data-table/fetch?store_id=${storeID}&category_id=${categoryID}&brand_id=${brandID}&status=${status}`,
				dataType: "json",
				headers: { "x-access-token": token },
				complete: function () {
					//$("#loadingScreen").hide();
					//$('.panel-refresh').click();
				},
				async: true,
				error: function (xhr, error, code) {
					console.log(xhr);
					console.log(code);
				},
			},
			columnDefs: [
				{
					orderable: false,
					targets: [
						1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
					],
				},
			],
			order: [[0, "desc"]],
			columns: [
				{
					data: "product_id",
					render: function (data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					},
				},
				{ data: "product_name" },
				{ data: "product_category_name" },
				{ data: "product_brand_name" },
				{ data: "product_cost_price" },
				{ data: "product_price" },
				{
					data: "product_stock",
					render: function (data, type, row, meta) {
						return row["product_expiry_date"] &&
							moment().isAfter(moment(row["product_expiry_date"]))
							? `<span class="badge badge-danger"> ` +
									data +
									` </span>`
							: parseInt(row["product_reorder_level"]) >=
							  parseInt(data)
							? `<span class="badge badge-warning"> ` +
							  data +
							  ` </span>`
							: `<span class="badge badge-success"> ` +
							  data +
							  ` </span>`;
					},
				},
				{ data: "product_measuring_units" },
				{ data: "product_reorder_level" },
				{ data: "product_vat_rate" },
				{ data: "product_discount_rate" },
				{
					data: "product_expiry_date",
					render: function (data, type, row, meta) {
						const date = moment(data);
						const formattedDate = date.isValid()
							? date.format("Do MMMM YYYY, hh:mm:ss A")
							: "-";
						return formattedDate;
					},
				},
				{ data: "product_expiry_discount_rate" },
				{ data: "store_name" },
				{
					data: "product_created_at",
					render: function (data, type, row, meta) {
						return moment
							.unix(data)
							.format("MMMM Do YYYY, h:mm:ss a");
					},
				},
				{
					data: "product_status",
					render: function (data, type, row, meta) {
						var productStatus =
							data == "Inactive"
								? `<span class="badge badge-danger"> ` +
								  data +
								  ` </span>`
								: `<span class="badge badge-success"> ` +
								  data +
								  ` </span>`;
						return productStatus;
					},
				},
				{
					data: "product_id",
					render: function (data, type, row, meta) {
						var actions =
							`
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit Product" data-id="` +
							data +
							`" data-toggle="modal" data-target="#editModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete Product" data-id="` +
							data +
							`"><i class="mdi mdi-close"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-qr-scan" title="Scan QR Code" data-id="` +
							data +
							`" data-toggle="modal" data-target="#qrModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-qrcode-scan"></i>
                            </a>
                        `;

						return actions;
					},
					searchable: false,
					sortable: false,
				},
			],
		});
	}

	//load stores
	function loadStores() {
		if (payloadClaim(token, "user_role") == "Super Admin") {
			blockUI();

			$.ajax({
				type: "GET",
				url: `${API_URL_ROOT}/stores?status=Active`,
				dataType: "json",
				headers: { "x-access-token": token },
				success: function (response) {
					if (response.error == false) {
						var stores = response.result.stores;
						var html = "";

						for (var i = 0; i < stores.length; i++) {
							html += `
                                <option value="${stores[i].store_id}">${stores[i].store_name}</option>
                            `;
						}

						$("#store_id").append(html);
						$("#store_id1").append(html);
						$("#store_id2").append(html);
						$(".selectpicker").selectpicker("refresh");
						unblockUI();
					} else {
						unblockUI();
						showSimpleMessage(
							"Attention",
							"ERROR - " + req.status + " : " + req.statusText,
							"error"
						);
					}
				},
				error: function (req, status, error) {
					unblockUI();
					showSimpleMessage(
						"Attention",
						"ERROR - " + req.status + " : " + req.statusText,
						"error"
					);
				},
			});
		}
	}

	//load categories
	function loadCategories() {
		blockUI();

		$.ajax({
			type: "GET",
			url: `${API_URL_ROOT}/categories?status=Active`,
			dataType: "json",
			headers: { "x-access-token": token },
			success: function (response) {
				if (response.error == false) {
					var categories = response.result.categories;
					var html = "";

					for (var i = 0; i < categories.length; i++) {
						html += `
                            <option value="${categories[i].product_category_id}">${categories[i].product_category_name}</option>
                        `;
					}

					$("#product_category_id").append(html);
					$("#product_category_id1").append(html);
					$("#product_category_id2").append(html);
					$(".selectpicker").selectpicker("refresh");
					unblockUI();
				} else {
					unblockUI();
					showSimpleMessage(
						"Attention",
						"ERROR - " + req.status + " : " + req.statusText,
						"error"
					);
				}
			},
			error: function (req, status, error) {
				unblockUI();
				showSimpleMessage(
					"Attention",
					"ERROR - " + req.status + " : " + req.statusText,
					"error"
				);
			},
		});
	}

	//load brands
	function loadBrands() {
		blockUI();

		$.ajax({
			type: "GET",
			url: `${API_URL_ROOT}/brands?status=Active`,
			dataType: "json",
			headers: { "x-access-token": token },
			success: function (response) {
				if (response.error == false) {
					var brands = response.result.brands;
					var html = "";

					for (var i = 0; i < brands.length; i++) {
						html += `
                            <option value="${brands[i].product_brand_id}">${brands[i].product_brand_name}</option>
                        `;
					}

					$("#product_brand_id").append(html);
					$("#product_brand_id1").append(html);
					$("#product_brand_id2").append(html);
					$(".selectpicker").selectpicker("refresh");
					unblockUI();
				} else {
					unblockUI();
					showSimpleMessage(
						"Attention",
						"ERROR - " + req.status + " : " + req.statusText,
						"error"
					);
				}
			},
			error: function (req, status, error) {
				unblockUI();
				showSimpleMessage(
					"Attention",
					"ERROR - " + req.status + " : " + req.statusText,
					"error"
				);
			},
		});
	}
});
