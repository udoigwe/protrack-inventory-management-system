$(function () {
	"use strict";

	let token = sessionStorage.getItem("token");
	/*const ps = new PerfectScrollbar(document.querySelector('.mt-container'));
	const secondUpload = new FileUploadWithPreview('mySecondImage')*/

	$(document).ready(function () {
		dashboard();

		//counter plugin
		$(".counter").counterUp({
			delay: 100,
			time: 1200,
		});

		$("#refresh").on("click", function (e) {
			e.preventDefault();
			dashboard();
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

					monthlyRevenueChart(dashboard.chart_data);
					dailyFinancialLossChart(dashboard.dailyLossChartData);
					topSellingProduct(dashboard.top_selling_products);
					productFinancialLoss(dashboard.financial_loss_on_products);
					loadActivities(dashboard.activities);
					loadReorderLevelProducts(dashboard.reorder_level_products);
					loadExpiredProducts(dashboard.expired_products);
					loadRecentSales(dashboard.recent_sales);
					loadDiscountedProducts(dashboard.discounted_products);
					$("#sales-count")
						.find(".counter")
						.text(formatNumber(dashboard.sales_count));
					$("#sales-income-total")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_income_from_sales
							)}`
						);
					$("#sales-income-total-this-month")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_income_from_sales_this_month
							)}`
						);
					$("#sales-income-total-today")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_income_from_sales_today
							)}`
						);
					$("#active-products-count")
						.find(".counter")
						.text(formatNumber(dashboard.active_products_count));
					$("#reorder-level-products-count")
						.find(".counter")
						.text(
							formatNumber(dashboard.reorder_level_products_count)
						);
					$("#purchase-orders-count")
						.find(".counter")
						.text(formatNumber(dashboard.purchase_orders_count));
					$("#total-expenditure-from-purchase-orders")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_expenditure_from_purchase_orders
							)}`
						);
					$("#total-expenditure-from-purchase-orders-this-month")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_expenditure_from_purchase_orders_this_month
							)}`
						);
					$("#total-expenditure-from-purchase-orders-today")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_expenditure_from_purchase_orders_today
							)}`
						);
					$("#total-income")
						.find(".counter")
						.text(`${formatCurrency(dashboard.total_income)}`);
					$("#total-income-this-month")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_income_this_month
							)}`
						);
					$("#total-income-today")
						.find(".counter")
						.text(
							`${formatCurrency(dashboard.total_income_today)}`
						);
					$("#total-expenditure")
						.find(".counter")
						.text(`${formatCurrency(dashboard.total_expenditure)}`);
					$("#total-expenditure-this-month")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_expenditure_this_month
							)}`
						);
					$("#total-expenditure-today")
						.find(".counter")
						.text(
							`${formatCurrency(
								dashboard.total_expenditure_today
							)}`
						);
					$("#admin-users-count")
						.find(".counter")
						.text(formatNumber(dashboard.admin_users_count));
					$("#cashier-users-count")
						.find(".counter")
						.text(formatNumber(dashboard.cashier_users_count));

					if (payloadClaim(token, "user_role") == "Super Admin") {
						$("#product-brands-count")
							.find(".counter")
							.text(formatNumber(dashboard.product_brands_count));
						$("#product-categories-count")
							.find(".counter")
							.text(
								formatNumber(dashboard.product_categories_count)
							);
						$("#super-admin-users-count")
							.find(".counter")
							.text(
								formatNumber(dashboard.super_admin_users_count)
							);
						$("#active-stores-count")
							.find(".counter")
							.text(formatNumber(dashboard.active_stores_count));
					}
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
			dom: `<"row"<"col-md-12"<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>><"col-md-12"rt><"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>>`,
			buttons: {
				buttons: [
					{ extend: "copy", className: "btn" },
					{ extend: "csv", className: "btn" },
					{ extend: "excel", className: "btn" },
					{ extend: "print", className: "btn" },
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
				{ data: "store_name" },
				{ data: "product_stock" },
				{ data: "product_reorder_level" },
				{ data: "batch_no" },
				{ data: "product_measuring_units" },
				{ data: "product_price" },
			],
			columnDefs: [
				{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
			],
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
				{ data: "store_name" },
				{ data: "product_stock" },
				{ data: "product_reorder_level" },
				{ data: "batch_no" },
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
				{ orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
			],
		});
	}

	function loadDiscountedProducts(products) {
		var formHTML = "";

		if ($.fn.dataTable.isDataTable("#discounted-products")) {
			$("#discounted-products").DataTable().destroy();
		}

		$("#discounted-products").DataTable({
			dom: `<"row"<"col-md-12"<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>><"col-md-12"rt><"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>>`,
			buttons: {
				buttons: [
					{ extend: "copy", className: "btn" },
					{ extend: "csv", className: "btn" },
					{ extend: "excel", className: "btn" },
					{ extend: "print", className: "btn" },
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
				{ data: "store_name" },
				{ data: "product_stock" },
				{ data: "product_reorder_level" },
				{ data: "batch_no" },
				{ data: "product_measuring_units" },
				{ data: "product_price" },
				{ data: "current_price" },
				{ data: "product_expiry_discount_rate" },
				{
					data: "product_expiration_date",
					render: function (data, type, row, meta) {
						return moment(data).format("MMMM Do YYYY, h:mm:ss a");
					},
				},
			],
			columnDefs: [
				{
					orderable: false,
					targets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
				},
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
				{ data: "invoice_uuid" },
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

	function monthlyRevenueChart(data) {
		var balance = sum_array(data.datasets.balanceArray);

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
			colors: ["#e7515a", "#1b55e2", "#009688"],
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
				text: "Revenue Generated This Year",
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
				text: formatNumber(balance),
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
					name: "Income",
					data: data.datasets.incomeArray,
				},
				{
					name: "Expenditure",
					data: data.datasets.expenditureArray,
				},
				{
					name: "Balance",
					data: data.datasets.balanceArray,
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
			document.querySelector("#monthly-revenue"),
			options2
		);

		chart2.render();
	}

	function topSellingProduct(data) {
		var options2 = {
			chart: {
				fontFamily: "Nunito, sans-serif",
				height: 365,
				type: "bar",
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
						const highest4 = ctx.getHighestValueInSeries(3);
						const highest5 = ctx.getHighestValueInSeries(4);

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

						ctx.addPointAnnotation({
							x: new Date(
								ctx.w.globals.seriesX[3][
									ctx.w.globals.series[3].indexOf(highest4)
								]
							).getTime(),
							y: highest4,
							label: {
								style: {
									cssClass: "d-none",
								},
							},
							customSVG: {
								SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#60f5ed" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
								cssClass: undefined,
								offsetX: -8,
								offsetY: 5,
							},
						});

						ctx.addPointAnnotation({
							x: new Date(
								ctx.w.globals.seriesX[4][
									ctx.w.globals.series[4].indexOf(highest5)
								]
							).getTime(),
							y: highest5,
							label: {
								style: {
									cssClass: "d-none",
								},
							},
							customSVG: {
								SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#3b424e" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
								cssClass: undefined,
								offsetX: -8,
								offsetY: 5,
							},
						});
					},
				},
			},
			colors: ["#e7515a", "#1b55e2", "#009688", "#60f5ed", "#3b424e"],
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
					{
						seriesIndex: 3,
						dataPointIndex: 11,
						fillColor: "#000",
						strokeColor: "#000",
						size: 4,
					},
					{
						seriesIndex: 4,
						dataPointIndex: 11,
						fillColor: "#000",
						strokeColor: "#000",
						size: 4,
					},
				],
			},
			subtitle: {
				text: "Best Selling Product in Hours",
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
				text: "Hourly Rating",
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
					name: "Avg. Sales Per Hour",
					data: data.map((item) => item.avg_sales_per_day),
				},
				{
					name: "Total Sold",
					data: data.map((item) => item.total_sold),
				},
				{
					name: "Percentage Stock Remaining (%)",
					data: data.map((item) => item.remaining_stock_percent),
				},
				{
					name: "Hours On Sale",
					data: data.map((item) => item.hours_on_sale),
				},
				{
					name: "Remaining Stock",
					data: data.map((item) => item.product_stock),
				},
			],
			labels: data.map((item) => item.product_name),
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
			document.querySelector("#best-selling-product"),
			options2
		);

		chart2.render();
	}

	function productFinancialLoss(data) {
		var options2 = {
			chart: {
				fontFamily: "Nunito, sans-serif",
				height: 365,
				type: "bar",
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
			colors: ["#e7515a", "#1b55e2", "#009688"],
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
				text: "Financial Loss On Expired Products",
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
				text: "Expired Products",
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
					name: "Financial Loss ($)",
					data: data.map((item) => item.financial_loss),
				},
				{
					name: "Expired Quantity In Stock",
					data: data.map((item) => item.product_stock),
				},
				{
					name: "Product Price ($)",
					data: data.map((item) => item.product_price),
				},
			],
			labels: data.map((item) => item.product_name),
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
			document.querySelector("#financial-loss-on-products"),
			options2
		);

		chart2.render();
	}

	function dailyFinancialLossChart(data) {
		var totalFinancialLoss = sum_array(data.datasets.financialLosses);

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
					},
				},
			},
			colors: ["#e7515a"],
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
				],
			},
			subtitle: {
				text: "Daily Financial Loss Per Month",
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
				text: formatNumber(totalFinancialLoss),
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
					name: "Financial Loss",
					data: data.datasets.financialLosses,
				},
			],
			labels: data.financialLossDates,
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
			document.querySelector("#daily-financial-loss-this-month"),
			options2
		);

		chart2.render();
	}
});
