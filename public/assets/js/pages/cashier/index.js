$(function () {
	("use strict");

	let token = sessionStorage.getItem("token");
	/*const ps = new PerfectScrollbar(document.querySelector('.mt-container'));
    const secondUpload = new FileUploadWithPreview('mySecondImage')*/

	$(document).ready(function () {
		dashboard();
		loadProducts();

		//counter plugin
		$(".counter").counterUp({
			delay: 100,
			time: 1200,
		});

		$("#refresh").on("click", function (e) {
			e.preventDefault();
			dashboard();
		});

		//return product stock
		$("#form-return-product-stock").on("submit", function (e) {
			e.preventDefault(); //prevent default form submission event
			returnStock(); //Internal function for form submission
		});
	});

	function dashboard() {
		$.ajax({
			type: "GET",
			url: `${API_URL_ROOT}/dashboard`,
			dataType: "json",
			headers: { "x-access-token": token },
			success: function (response) {
				if (response.error == false) {
					var dashboard = response.dashboard;
					monthlySalesChart(dashboard.chart_data);
					loadActivities(dashboard.activities);
					loadReorderLevelProducts(dashboard.reorder_level_products);
					loadExpiredProducts(dashboard.expired_products);
					loadRecentSales(dashboard.recent_sales);
					$("#sales-count")
						.find(".counter")
						.text(formatNumber(dashboard.sales_count));
					$("#sales-count-this-month")
						.find(".counter")
						.text(formatNumber(dashboard.sales_count_this_month));
					$("#sales-count-today")
						.find(".counter")
						.text(formatNumber(dashboard.sales_count_today));
					$("#total-amount-sold")
						.find(".counter")
						.text(`${formatCurrency(dashboard.total_amount_sold)}`);
					$("#total-amount-sold-this-month")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_amount_sold_this_month
							)}`
						);
					$("#total-amount-sold-today")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_amount_sold_today
							)}`
						);
				} else {
					showSimpleMessage("Attention", response.message, "error");
				}
			},
			error: function (req, err, status) {
				showSimpleMessage(
					"Attention",
					"ERROR - " + req.status + " : " + req.statusText,
					"error"
				);
			},
		});
	}

	function loadActivities(activities) {
		var activitiesHTML = "";

		//user activity log
		for (var i = 0; i < activities.length; i++) {
			activitiesHTML +=
				`
                <div class="inbox-item">
                    <a href="#">
                        <p class="inbox-item-text">` +
				activities[i].activity.toUpperCaseWords() +
				`</p>
                        <p class="inbox-item-author">` +
				activities[i].action +
				`</p>
                        <p class="inbox-item-date">` +
				moment.unix(activities[i].created_at).fromNow() +
				`</p>
                    </a>
                </div>
            `;
		}

		$(".timeline-line").html(activitiesHTML);
	}

	function loadReorderLevelProducts(products) {
		var formHTML = "";

		if ($.fn.dataTable.isDataTable("#reorder-level-products")) {
			$("#reorder-level-products").DataTable().destroy();
		}

		$("#reorder-level-products").DataTable({
			autoWidth: false,
			paging: false,
			searching: false,
			data: products,
			columns: [
				{
					data: "product_id",
					render: function (data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					},
				},
				{ data: "product_name" },
				{ data: "product_brand_name" },
				{ data: "product_category_name" },
				{ data: "product_stock" },
				{ data: "product_reorder_level" },
				{ data: "product_measuring_units" },
				{ data: "product_price" },
			],
			columnDefs: [{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7] }],
		});
	}

	function loadExpiredProducts(products) {
		var formHTML = "";

		if ($.fn.dataTable.isDataTable("#expired-products")) {
			$("#expired-products").DataTable().destroy();
		}

		$("#expired-products").DataTable({
			dom: `<"row"<"col-md-12"<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>><"col-md-12"rt><"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>>`,
			buttons: {
				buttons: [
					{ extend: "copy", className: "btn" },
					{ extend: "csv", className: "btn" },
					{ extend: "excel", className: "btn" },
					{ extend: "print", className: "btn" },
					{
						className: "btn",
						text: "Return Stock",
						attr: {
							title: "Return Stock",
							id: "btn-return-stock",
							"data-toggle": "modal",
							"data-target": "#productModal",
							"data-animation": "fall",
							"data-plugin": "custommodal",
							"data-overlayColor": "#012",
						},
					},
				],
			},
			autoWidth: false,
			paging: false,
			searching: false,
			data: products,
			columns: [
				{
					data: "product_id",
					render: function (data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					},
				},
				{ data: "product_name" },
				{ data: "product_brand_name" },
				{ data: "product_category_name" },
				{ data: "product_stock" },
				{ data: "product_reorder_level" },
				{ data: "product_measuring_units" },
				{ data: "product_price" },
				{
					data: "product_expiry_date",
					render: function (data, type, row, meta) {
						return moment(data).format("MMM Do, YYYY hh:mm:ss A");
					},
				},
			],
			columnDefs: [
				{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 8] },
			],
		});
	}

	function loadRecentSales(sales) {
		var formHTML = "";

		if ($.fn.dataTable.isDataTable("#recent-sales")) {
			$("#recent-sales").DataTable().destroy();
		}

		$("#recent-sales").DataTable({
			autoWidth: false,
			paging: false,
			searching: false,
			data: sales,
			columns: [
				{
					data: "invoice_id",
					render: function (data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					},
				},
				{ data: "store_name" },
				{ data: "cashier" },
				{
					data: "invoice_gross_total",
					render: function (data, type, row, meta) {
						return formatNumber(data);
					},
				},
				{
					data: "total_invoice_vat",
					render: function (data, type, row, meta) {
						return formatNumber(data);
					},
				},
				{
					data: "total_invoice_discount",
					render: function (data, type, row, meta) {
						return formatNumber(data);
					},
				},
				{
					data: "invoice_net_total",
					render: function (data, type, row, meta) {
						return formatNumber(data);
					},
				},
				{
					data: "invoice_order_timestamp",
					render: function (data, type, row, meta) {
						return moment
							.unix(data)
							.format("MMMM Do YYYY, h:mm:ss a");
					},
				},
			],
			columnDefs: [{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7] }],
		});
	}

	//sum of multiple arrays
	function sum_array(arr) {
		// store our final answer
		var sum = 0;

		// loop through entire array
		for (var i = 0; i < arr.length; i++) {
			/*// loop through each inner array
            for (var j = 0; j < arr[i].length; j++) {
          
                // add this number to the current final sum
                sum += arr[i][j];
          
            }*/
			sum += arr[i];
		}

		return sum;
	}

	function monthlySalesChart(data) {
		var total_sold = data.datasets.total_sold;

		var options2 = {
			chart: {
				fontFamily: "Nunito, sans-serif",
				height: 365,
				type: "area",
				zoom: {
					enabled: false,
				},
				dropShadow: {
					enabled: true,
					opacity: 0.3,
					blur: 5,
					left: -7,
					top: 22,
				},
				toolbar: {
					show: true,
				},
				events: {
					mounted: function (ctx, config) {
						const highest1 = ctx.getHighestValueInSeries(0);
						const highest2 = ctx.getHighestValueInSeries(1);
						const highest3 = ctx.getHighestValueInSeries(2);

						ctx.addPointAnnotation({
							x: new Date(
								ctx.w.globals.seriesX[0][
									ctx.w.globals.series[0].indexOf(highest1)
								]
							).getTime(),
							y: highest1,
							label: {
								style: {
									cssClass: "d-none",
								},
							},
							customSVG: {
								SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#e7515a" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
								cssClass: undefined,
								offsetX: -8,
								offsetY: 5,
							},
						});

						ctx.addPointAnnotation({
							x: new Date(
								ctx.w.globals.seriesX[1][
									ctx.w.globals.series[1].indexOf(highest2)
								]
							).getTime(),
							y: highest2,
							label: {
								style: {
									cssClass: "d-none",
								},
							},
							customSVG: {
								SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1b55e2" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
								cssClass: undefined,
								offsetX: -8,
								offsetY: 5,
							},
						});

						ctx.addPointAnnotation({
							x: new Date(
								ctx.w.globals.seriesX[2][
									ctx.w.globals.series[2].indexOf(highest3)
								]
							).getTime(),
							y: highest3,
							label: {
								style: {
									cssClass: "d-none",
								},
							},
							customSVG: {
								SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#009688" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
								cssClass: undefined,
								offsetX: -8,
								offsetY: 5,
							},
						});
					},
				},
			},
			colors: ["#009688"],
			dataLabels: {
				enabled: false,
			},
			markers: {
				discrete: [
					{
						seriesIndex: 0,
						dataPointIndex: 7,
						fillColor: "#000",
						strokeColor: "#000",
						size: 5,
					},
					{
						seriesIndex: 1,
						dataPointIndex: 11,
						fillColor: "#000",
						strokeColor: "#000",
						size: 4,
					},
					{
						seriesIndex: 2,
						dataPointIndex: 11,
						fillColor: "#000",
						strokeColor: "#000",
						size: 4,
					},
				],
			},
			subtitle: {
				text: "Your Sales This Year",
				align: "left",
				margin: 0,
				offsetX: -10,
				offsetY: 35,
				floating: false,
				style: {
					fontSize: "14px",
					color: "#888ea8",
				},
			},
			title: {
				text: formatNumber(total_sold),
				align: "left",
				margin: 0,
				offsetX: -10,
				offsetY: 0,
				floating: false,
				style: {
					fontSize: "25px",
					color: "#bfc9d4",
				},
			},
			stroke: {
				show: true,
				curve: "smooth",
				width: 2,
				lineCap: "square",
			},
			series: [
				{
					name: "Amount Sold",
					data: data.datasets.salesArray,
				},
			],
			labels: data.labels,
			xaxis: {
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
				crosshairs: {
					show: true,
				},
				labels: {
					offsetX: 0,
					offsetY: 5,
					style: {
						fontSize: "12px",
						fontFamily: "Nunito, sans-serif",
						cssClass: "apexcharts-xaxis-title",
					},
				},
			},
			yaxis: {
				labels: {
					formatter: function (value, index) {
						//return (value / 1000) + 'K'
						return value / 1;
					},
					offsetX: -22,
					offsetY: 0,
					style: {
						fontSize: "12px",
						fontFamily: "Nunito, sans-serif",
						cssClass: "apexcharts-yaxis-title",
					},
				},
			},
			grid: {
				borderColor: "#191e3a",
				strokeDashArray: 5,
				xaxis: {
					lines: {
						show: true,
					},
				},
				yaxis: {
					lines: {
						show: false,
					},
				},
				padding: {
					top: 0,
					right: 0,
					bottom: 0,
					left: -10,
				},
			},
			legend: {
				position: "top",
				horizontalAlign: "right",
				offsetY: -50,
				fontSize: "16px",
				fontFamily: "Nunito, sans-serif",
				markers: {
					width: 10,
					height: 10,
					strokeWidth: 0,
					strokeColor: "#fff",
					fillColors: undefined,
					radius: 12,
					onClick: undefined,
					offsetX: 0,
					offsetY: 0,
				},
				itemMargin: {
					horizontal: 0,
					vertical: 20,
				},
			},
			tooltip: {
				theme: "dark",
				marker: {
					show: true,
				},
				x: {
					show: true,
				},
			},
			fill: {
				type: "gradient",
				gradient: {
					type: "vertical",
					shadeIntensity: 1,
					inverseColors: !1,
					opacityFrom: 0.28,
					opacityTo: 0.05,
					stops: [45, 100],
				},
			},
			responsive: [
				{
					breakpoint: 575,
					options: {
						legend: {
							offsetY: -30,
						},
					},
				},
			],
		};

		var chart2 = new ApexCharts(
			document.querySelector("#monthly-sales"),
			options2
		);

		chart2.render();
	}

	//load products
	function loadProducts() {
		var storeID =
			payloadClaim(token, "user_role") !== "Super Admin"
				? payloadClaim(token, "user_store_id")
				: $("#store_id1").find("option:selected").val();

		blockUI();

		$.ajax({
			type: "GET",
			url: `${API_URL_ROOT}/products?store_id=${storeID}`,
			dataType: "json",
			headers: { "x-access-token": token },
			success: function (response) {
				if (response.error == false) {
					var products = response.result.products;
					var html = "";

					for (var i = 0; i < products.length; i++) {
						html += `
                            <option value="${products[i].product_id}">${products[i].product_name}</option>
                        `;
					}

					$("select.product_id").append(html);
					$(".selectpicker").selectpicker("refresh");
					unblockUI();
				} else {
					unblockUI();
					showSimpleMessage("Attention", response.message, "error");
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

	//return product stock
	function returnStock() {
		swal({
			title: "Attention",
			text: "Are you sure you want to return this product stock?",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes!",
			cancelButtonText: "No!",
		}).then(function (result) {
			if (result.value) {
				//name vairables
				var form = $("#form-return-product-stock"); //form
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
					url: `${API_URL_ROOT}/return-product-stock`,
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
});
