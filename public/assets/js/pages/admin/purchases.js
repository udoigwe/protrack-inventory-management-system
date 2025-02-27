$(function () {
	"use strict";

	let token = sessionStorage.getItem("token");

	$(document).ready(function ($) {
		dataTableAlertPrevent("table");
		fixTableResponsive();
		loadUsers();
		loadStores();
		loadPurchases();
		newOrderItem();
		removeOrderItem();
		pricing();
		purchaseModalSetup();
		print();

		$("#datepicker").datepicker({
			format: "yyyy-mm-dd",
		});

		$("#datepicker1").datepicker({
			format: "yyyy-mm-dd",
		});

		$("#purchases").on("click", ".btn-delete", function () {
			var purchaseOrderID = $(this).attr("data-id");
			deletePurchaseOrder(purchaseOrderID);
		});

		$("#purchases").on("click", ".btn-print", function () {
			var purchaseID = $(this).attr("data-id");
			var printModal = $("#printModal");

			//fetch user details
			$.ajax({
				url: `${API_URL_ROOT}/purchases/${purchaseID}`,
				type: "GET",
				dataType: "json",
				headers: { "x-access-token": token },
				success: function (response) {
					if (response.error == false) {
						var purchase = response.purchase;
						var items = purchase.items;
						var itemsHTML = "";
						var serial = 0;

						printModal
							.find(".modal-title")
							.text(purchase.purchase_order_uuid);
						printModal
							.find(".company-name")
							.text(purchase.company_name);
						printModal
							.find(".order-date")
							.text(
								moment
									.unix(purchase.purchase_order_timestamp)
									.format("MMMM Do, YYYY")
							);
						printModal
							.find(".order-status")
							.html(
								`${
									purchase.purchase_order_status == "Paid"
										? `<span class="badge badge-success">Paid</span>`
										: purchase.purchase_order_status ==
										  "Unpaid"
										? `<span class="badge badge-danger">Unpaid</span>`
										: `<span class="badge badge-warning">Incomplete Payment</span>`
								}`
							);
						printModal
							.find(".purchase-uuid")
							.text(purchase.purchase_order_id);
						printModal.find(".store").text(purchase.store_name);
						printModal
							.find(".contact-person")
							.text(purchase.user_phone);
						printModal
							.find(".purchase_order_total_amount")
							.text(
								formatNumber(
									purchase.purchase_order_total_amount
								)
							);

						for (var i = 0; i < items.length; i++) {
							const item = items[i];

							itemsHTML += `
                                <tr>
                                    <td>${(serial += 1)}</td>
                                    <td>${item.purchase_order_item}</td>
                                    <td>${item.purchase_order_item_qty}</td>
                                    <td>${formatNumber(
										item.purchase_order_item_unit_price
									)}</td>
                                    <td>${formatNumber(
										item.purchase_order_item_qty *
											item.purchase_order_item_unit_price
									)}</td>
                                </tr>
                            `;
						}

						printModal.find("#item-list tbody").html(itemsHTML);
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

		$("#purchases").on("click", ".btn-edit", function () {
			var purchaseOrderID = $(this).attr("data-id");
			var editPurchaseModal = $("#editPurchaseModal");

			//fetch user details
			$.ajax({
				url: `${API_URL_ROOT}/purchases/${purchaseOrderID}`,
				type: "GET",
				dataType: "json",
				headers: { "x-access-token": token },
				success: function (response) {
					if (response.error == false) {
						var purchase = response.purchase;
						var items = purchase.items;
						var itemsHTML = "";
						var serial = 0;

						editPurchaseModal
							.find(".modal-title")
							.text(purchase.purchase_order_uuid);
						editPurchaseModal
							.find(".cashier")
							.text(purchase.contact_person);
						editPurchaseModal
							.find("#company_name1")
							.val(purchase.company_name);
						editPurchaseModal
							.find(".order-date")
							.text(
								moment
									.unix(purchase.purchase_order_timestamp)
									.format("MMMM Do, YYYY")
							);
						editPurchaseModal
							.find("#purchase_order_status1")
							.selectpicker(
								"val",
								purchase.purchase_order_status
							);
						editPurchaseModal
							.find("#store_id2")
							.selectpicker("val", purchase.store_id);
						editPurchaseModal
							.find(".purchase_order_total_amount")
							.attr(
								"data-value",
								purchase.purchase_order_total_amount
							);
						editPurchaseModal
							.find(".purchase_order_total_amount")
							.text(
								formatNumber(
									purchase.purchase_order_total_amount
								)
							);
						editPurchaseModal
							.find("#purchase_order_id")
							.val(purchaseOrderID);

						for (var i = 0; i < items.length; i++) {
							const item = items[i];

							itemsHTML += `
                                <tr data-row-id="${uuidv4()}">
                                    <td>
                                        <input type="text" class="form-control required purchase_order_item" placeholder="Item name" name="purchase_order_item" value="${
											item.purchase_order_item
										}">
                                    </td>
                                    <td>
                                        <input type="number" class="form-control required purchase_order_item_qty" placeholder="Quantity Ordered" name="purchase_order_item_qty" value="${
											item.purchase_order_item_qty
										}">
                                    </td>
                                    <td>
                                        <input type="number" class="form-control purchase_order_item_unit_price required" placeholder="Unit Price of Item" name="purchase_order_item_unit_price" value="${
											item.purchase_order_item_unit_price
										}">
                                    </td>
                                    <td>
                                        <input type="number" class="form-control sub_total required" placeholder="Sub Total" name="sub_total" value="${
											item.purchase_order_item_qty *
											item.purchase_order_item_unit_price
										}" readonly>
                                    </td>
                                    <td>
                                        <a href="javascript:void(0)" class="btn btn-add  btn-warning btn-sm waves-effect waves-light"><i class="mdi mdi-plus"></i></a>
                                        <a href="javascript:void(0)" class="btn btn-remove btn-danger btn-sm waves-effect waves-light"><i class="mdi mdi-minus"></i></a>
                                    </td>
                                </tr>           
                            `;
						}

						editPurchaseModal
							.find("#ordered-items-list1 tbody")
							.html(itemsHTML);
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
			var storeID = form.find("#store_id").val();
			var userID = form.find("#user_id").val();
			var status = form.find("#status").val();
			var startTime = form.find("#datepicker").val();
			var endTime = form.find("#datepicker1").val();
			var fields = form.find("input.required, select.required");

			blockUI();

			for (var i = 0; i < fields.length; i++) {
				if (fields[i].value == "") {
					/*alert(fields[i].id)*/
					$("#" + fields[i].id).focus();
					unblockUI();
					showSimpleMessage(
						"Attention",
						`${fields[i].name} is required`,
						"error"
					);
					return false;
				}
			}

			loadPurchases(storeID, userID, status, startTime, endTime);
			unblockUI();
		});

		$("#form-new-purchase").on("submit", function (e) {
			e.preventDefault();

			submitPurchaseOrder();
		});

		$("#form-update-purchase").on("submit", function (e) {
			e.preventDefault();

			updatePurchaseOrder();
		});
	});

	//internal function to delete a purchase order
	function deletePurchaseOrder(purchaseOrderID) {
		swal({
			title: "Attention",
			text: "Are you sure you want to delete this purchase order?",
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
				var table = $("#purchases");

				blockUI();

				$.ajax({
					type: "DELETE",
					url: `${API_URL_ROOT}/purchases/${purchaseOrderID}`,
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

	//load purchases
	function loadPurchases(
		storeID = "",
		userID = "",
		status = "",
		startTime = "",
		endTime = ""
	) {
		var table = $("#purchases");

		var storeID =
			payloadClaim(token, "user_role") !== "Super Admin"
				? payloadClaim(token, "user_store_id")
				: storeID;

		table.DataTable({
			dom: `<"row"<"col-md-12"<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>><"col-md-12"rt><"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>>`,
			buttons: {
				buttons: [
					{ extend: "copy", className: "btn" },
					{ extend: "csv", className: "btn" },
					{ extend: "excel", className: "btn" },
					{ extend: "print", className: "btn" },
					{
						className: "btn",
						text: "Purchase Stock",
						attr: {
							title: "Purchase Stock",
							id: "btn-new-purchase",
							"data-toggle": "modal",
							"data-target": "#purchaseModal",
							"data-animation": "fall",
							"data-plugin": "custommodal",
							"data-overlayColor": "#012",
						},
					},
				],
			},
			oLanguage: {
				oPaginate: {
					sPrevious:
						'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>',
					sNext: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
				},
				sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
				sSearch:
					'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
				sSearchPlaceholder: "Search...",
				sLengthMenu: "Results :  _MENU_",
			},
			lengthMenu: [7, 10, 20, 50, 100, 500, 1000],
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
				url: `${API_URL_ROOT}/purchases/data-table/fetch?store_id=${storeID}&user_id=${userID}&status=${status}&start_time=${startTime}&end_time=${endTime}`,
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
				{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 8] },
			],
			order: [[0, "desc"]],
			columns: [
				{
					data: "purchase_order_id",
					render: function (data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					},
				},
				{ data: "store_name" },
				{ data: "purchase_order_uuid" },
				{ data: "contact_person" },
				{ data: "company_name" },
				{
					data: "purchase_order_total_amount",
					render: function (data, type, row, meta) {
						return formatNumber(data);
					},
				},
				{
					data: "purchase_order_timestamp",
					render: function (data, type, row, meta) {
						return moment
							.unix(data)
							.format("MMMM Do YYYY, h:mm:ss a");
					},
				},
				{
					data: "purchase_order_status",
					render: function (data, type, row, meta) {
						var purchaseOrderStatus =
							data == "Unpaid"
								? `<span class="badge badge-danger"> ` +
								  data +
								  ` </span>`
								: data == "Paid"
								? `<span class="badge badge-success"> ` +
								  data +
								  ` </span>`
								: `<span class="badge badge-warning"> ` +
								  data +
								  ` </span>`;
						return purchaseOrderStatus;
					},
				},
				{
					data: "purchase_order_id",
					render: function (data, type, row, meta) {
						var actions =
							`
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-print" title="Print Purchase Order" data-id="` +
							data +
							`" data-toggle="modal" data-target="#printModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-printer"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit Purchase Order" data-id="` +
							data +
							`" data-toggle="modal" data-target="#editPurchaseModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete Purchase Order" data-id="` +
							data +
							`"><i class="mdi mdi-close"></i>
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

	function loadUsers() {
		var storeID =
			payloadClaim(token, "user_role") == "Super Admin"
				? ""
				: payloadClaim(token, "user_store_id");

		$.ajax({
			url: `${API_URL_ROOT}/users?store_id=${storeID}`,
			type: "GET",
			dataType: "json",
			headers: { "x-access-token": token },
			success: function (response) {
				var users = response.result.users;
				var html = "";

				for (var i = 0; i < users.length; i++) {
					html += `
                        <option value="${users[i].user_id}">${users[i].user_firstname} ${users[i].user_lastname}</option>
                    `;
				}

				$("#user_id").append(html);
				$(".selectpicker").selectpicker("refresh");
			},
			error: function (req, status, err) {
				showSimpleMessage(
					"Attention",
					"ERROR - " + req.status + " : " + req.statusText,
					"error"
				);
			},
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
		}
	}

	function priceSummary(parentModal) {
		var total = 0;

		parentModal
			.find("tbody")
			.find("tr")
			.each(function () {
				total += parseFloat($(this).find(".sub_total").val() || 0);
			});

		parentModal
			.find(".purchase_order_total_amount")
			.attr("data-value", total);
		parentModal
			.find(".purchase_order_total_amount")
			.text(formatNumber(total));
	}

	function pricing() {
		$("#ordered-items-list, #ordered-items-list1").on(
			"keyup change",
			".purchase_order_item_qty, .purchase_order_item_unit_price",
			function () {
				var _this = $(this);
				var parentModal = _this.parents(".modal");
				var parentTable = _this.parents(".table");
				var parentTR = _this.parents("tr");
				var qty = parseFloat(
					parentTR.find(".purchase_order_item_qty").val() || 0
				);
				var unitPrice = parseFloat(
					parentTR.find(".purchase_order_item_unit_price").val() || 0
				);

				if (isNaN(_this.val())) {
					showSimpleMessage(
						"Attention",
						"Quantity ordered & Unit Price must be numbers only",
						"error"
					);

					_this.val(0);
				} else {
					parentTR.find(".sub_total").val(qty * unitPrice);

					priceSummary(parentModal);
				}
			}
		);
	}

	function removeOrderItem() {
		$("#ordered-items-list, #ordered-items-list1").on(
			"click",
			".btn-remove",
			function () {
				var parentModal = $(this).parents(".modal");

				var parentTable = $(this).parents(".table");

				var parentTR = $(this).parents("tr");

				var TRCount = parentTable.find("tbody").find("tr").length;

				if (TRCount == 1) {
					showSimpleMessage(
						"Attention",
						"You cannot remove all records",
						"error"
					);
					return false;
				}

				parentTR.remove();

				priceSummary(parentModal);
			}
		);
	}

	function newOrderItem() {
		$("#ordered-items-list, #ordered-items-list1").on(
			"click",
			".btn-add",
			function () {
				var parentModal = $(this).parents(".modal");

				var parentTR = $(this).parents("tr");

				var rowID = parseInt(parentTR.attr("data-row-id"));

				var uuidV4 = uuidv4();

				var storeID =
					payloadClaim(token, "user_role") == "Super Admin"
						? parentModal
								.find(".store_id")
								.find("option:selected")
								.val()
						: payloadClaim(token, "user_store_id");

				blockUI();

				var TR = `
                <tr data-row-id="${uuidV4}">
                    <td>
                        <input type="text" class="form-control required purchase_order_item" placeholder="Item name" name="purchase_order_item">
                    </td>
                    <td>
                        <input type="number" class="form-control required purchase_order_item_qty" placeholder="Quantity Ordered" name="purchase_order_item_qty">
                    </td>
                    <td>
                        <input type="number" class="form-control purchase_order_item_unit_price required" placeholder="Unit Price of Item" name="purchase_order_item_unit_price">
                    </td>
                    <td>
                        <input type="number" class="form-control sub_total required" placeholder="Sub Total" name="sub_total" readonly>
                    </td>
                    <td>
                        <a href="javascript:void(0)" class="btn btn-add  btn-warning btn-sm waves-effect waves-light"><i class="mdi mdi-plus"></i></a>
                        <a href="javascript:void(0)" class="btn btn-remove btn-danger btn-sm waves-effect waves-light"><i class="mdi mdi-minus"></i></a>
                    </td>
                </tr>
            `;

				$(TR).insertAfter(parentTR);

				unblockUI();
			}
		);
	}

	function fixTableResponsive() {
		$(".table-responsive")
			.on("shown.bs.dropdown", function (e) {
				var t = $(this),
					m = $(e.target).find(".dropdown-menu"),
					tb = t.offset().top + t.height(),
					mb = m.offset().top + m.outerHeight(true),
					d = 20; // Space for shadow + scrollbar.

				if (t[0].scrollWidth > t.innerWidth()) {
					if (mb + d > tb) {
						t.css("padding-bottom", mb + d - tb);
					}
				} else {
					t.css("overflow", "visible");
				}
			})
			.on("hidden.bs.dropdown", function () {
				$(this).css({
					"padding-bottom": "",
					overflow: "",
				});
			});
	}

	function purchaseModalSetup() {
		$(".cashier").text(
			`${payloadClaim(token, "user_firstname")} ${payloadClaim(
				token,
				"user_lastname"
			)}`
		);
		$(".order_date").text(`${moment().format("MMMM Do, YYYY")}`);
	}

	function submitPurchaseOrder() {
		swal({
			title: "Attention",
			text: "Are you sure you want to submit this Purchase Order?",
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
				var form = $("#form-new-purchase"); //form
				var fields = form.find("input.required, select.required");
				var purchaseOrderTotalAmount = $(
					".purchase_order_total_amount"
				).attr("data-value");
				var table = $("#purchases").DataTable();
				var purchaseModal = $("#purchaseModal");

				var items = [];

				blockUI();

				for (var i = 0; i < fields.length; i++) {
					if (fields[i].value == "") {
						unblockUI();
						form.find(`[name="${fields[i].name}"]`).focus();
						showSimpleMessage(
							"Attention",
							`${fields[i].name} is required`,
							"error"
						);
						return false;
					}
				}

				$("#ordered-items-list tbody")
					.find("tr")
					.each(function (index) {
						if (
							(parseFloat(
								$(this).find(".purchase_order_item_qty").val()
							) || 0) != 0 &&
							(parseFloat(
								$(this)
									.find(".purchase_order_item_unit_price")
									.val()
							) || 0) != 0 &&
							(parseFloat($(this).find(".sub_total").val()) ||
								0) != 0
						) {
							var item = {
								purchase_order_item: $(this)
									.find(".purchase_order_item")
									.val(),
								purchase_order_item_qty: $(this)
									.find(".purchase_order_item_qty")
									.val(),
								purchase_order_item_unit_price: $(this)
									.find(".purchase_order_item_unit_price")
									.val(),
								sub_total: $(this).find(".sub_total").val(),
							};

							items.push(item);
						}
					});

				//remove any form meta existing
				form.find("#purchase_order_total_amount").remove();
				form.find("#purchase_order_items").remove();

				// Append formmeta to the form.
				$("<input>")
					.attr({
						type: "hidden",
						name: "purchase_order_total_amount",
						id: "purchase_order_total_amount",
						value: purchaseOrderTotalAmount,
					})
					.appendTo(form);
				$("<input>")
					.attr({
						type: "hidden",
						name: "purchase_order_items",
						id: "purchase_order_items",
						value: JSON.stringify(items),
					})
					.appendTo(form);

				$.ajax({
					type: "POST",
					url: API_URL_ROOT + "/purchases",
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
							//salesModal.find('.close').click();
							refreshForm();
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

	function updatePurchaseOrder() {
		swal({
			title: "Attention",
			text: "Are you sure you want to update this Purchase Order?",
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
				var form = $("#form-update-purchase"); //form
				var fields = form.find("input.required, select.required");
				var purchaseOrderTotalAmount = form
					.find(".purchase_order_total_amount")
					.attr("data-value");
				var purchaseOrderID = form.find("#purchase_order_id").val();
				var table = $("#purchases").DataTable();
				var editPurchaseModal = $("#editPurchaseModal");

				var items = [];

				blockUI();

				for (var i = 0; i < fields.length; i++) {
					if (fields[i].value == "") {
						unblockUI();
						form.find(`[name="${fields[i].name}"]`).focus();
						showSimpleMessage(
							"Attention",
							`${fields[i].name} is required`,
							"error"
						);
						return false;
					}
				}

				$("#ordered-items-list1 tbody")
					.find("tr")
					.each(function (index) {
						if (
							(parseFloat(
								$(this).find(".purchase_order_item_qty").val()
							) || 0) != 0 &&
							(parseFloat(
								$(this)
									.find(".purchase_order_item_unit_price")
									.val()
							) || 0) != 0 &&
							(parseFloat($(this).find(".sub_total").val()) ||
								0) != 0
						) {
							var item = {
								purchase_order_item: $(this)
									.find(".purchase_order_item")
									.val(),
								purchase_order_item_qty: $(this)
									.find(".purchase_order_item_qty")
									.val(),
								purchase_order_item_unit_price: $(this)
									.find(".purchase_order_item_unit_price")
									.val(),
								sub_total: $(this).find(".sub_total").val(),
							};

							items.push(item);
						}
					});

				//remove any form meta existing
				form.find("#purchase_order_total_amount").remove();
				form.find("#purchase_order_items").remove();

				// Append formmeta to the form.
				$("<input>")
					.attr({
						type: "hidden",
						name: "purchase_order_total_amount",
						id: "purchase_order_total_amount",
						value: purchaseOrderTotalAmount,
					})
					.appendTo(form);
				$("<input>")
					.attr({
						type: "hidden",
						name: "purchase_order_items",
						id: "purchase_order_items",
						value: JSON.stringify(items),
					})
					.appendTo(form);

				$.ajax({
					type: "PUT",
					url: `${API_URL_ROOT}/purchases/${purchaseOrderID}`,
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
							editPurchaseModal.find(".close").click();
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

	function refreshForm() {
		var itemList = `
            <tr data-row-id="1">
                <td>
                    <input type="text" class="form-control required purchase_order_item" placeholder="Item name" name="purchase_order_item">
                </td>
                <td>
                    <input type="number" class="form-control required purchase_order_item_qty" placeholder="Quantity Ordered" name="purchase_order_item_qty">
                </td>
                <td>
                    <input type="number" class="form-control purchase_order_item_unit_price required" placeholder="Unit Price of Item" name="purchase_order_item_unit_price">
                </td>
                <td>
                    <input type="number" class="form-control sub_total required" placeholder="Sub Total" name="sub_total" readonly>
                </td>
                <td>
                    <a href="javascript:void(0)" class="btn btn-add  btn-warning btn-sm waves-effect waves-light"><i class="mdi mdi-plus"></i></a>
                    <a href="javascript:void(0)" class="btn btn-remove btn-danger btn-sm waves-effect waves-light"><i class="mdi mdi-minus"></i></a>
                </td>
            </tr>
        `;

		var summaryHTML = `
            <p><b>Total:</b> <span class="float-right"> &nbsp;&nbsp;&nbsp;</p>
            <h3><span>NGN</span> <span class="purchase_order_total_amount" data-value="0">0</h3>
        `;

		$("#ordered-items-list tbody").html(itemList);
		$(".summary").html(summaryHTML);
		$(".selectpicker").selectpicker("refresh");
	}

	function print() {
		$("#printModal").on("click", ".btn-print", function () {
			const content = $(".content");

			const printArea = $("#printModal .print-area").detach();
			const containerFluid = $(".container-fluid").detach();

			content.append(printArea);

			const backdrop = $("body .modal-backdrop").detach();
			$(".modal-backdrop").hide();

			window.print();

			content.empty();
			content.append(containerFluid);

			$("#printModal .modal-body").append(printArea);

			$("body").append(backdrop);
		});
	}
});
