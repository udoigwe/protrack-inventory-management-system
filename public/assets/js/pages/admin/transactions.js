$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

    $(document).ready(function($){

        dataTableAlertPrevent('table');
        loadUsers();
        loadStores();
        loadTransactions();
        print();

        $('#datepicker').datepicker({
            format: 'yyyy-mm-dd'
        })

        $('#datepicker1').datepicker({
            format: 'yyyy-mm-dd'
        });

        $('#transactions').on('click', '.btn-delete', function(){
            var transactionID = $(this).attr('data-id');
            deleteTransaction(transactionID);  
        });

        $('#purchases').on('click', '.btn-print', function(){
            var purchaseID = $(this).attr('data-id');
            var printModal = $('#printModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/purchases/${purchaseID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var purchase = response.purchase;
                        var items = purchase.items;
                        var itemsHTML = '';
                        var serial = 0;

                        printModal.find('.modal-title').text(purchase.purchase_order_uuid);
                        printModal.find('.company-name').text(purchase.company_name);
                        printModal.find('.order-date').text(moment.unix(purchase.purchase_order_timestamp).format('MMMM Do, YYYY'));
                        printModal.find('.order-status').html(`${purchase.purchase_order_status == "Paid" ? `<span class="badge badge-success">Paid</span>` : purchase.purchase_order_status == "Unpaid" ? `<span class="badge badge-danger">Unpaid</span>` : `<span class="badge badge-warning">Incomplete Payment</span>`}`);
                        printModal.find('.purchase-uuid').text(purchase.purchase_order_id);
                        printModal.find('.store').text(purchase.store_name);
                        printModal.find('.contact-person').text(purchase.user_phone);
                        printModal.find('.purchase_order_total_amount').text(formatNumber(purchase.purchase_order_total_amount));

                        for(var i = 0; i < items.length; i++)
                        {
                            const item = items[i];

                            itemsHTML += `
                                <tr>
                                    <td>${serial += 1}</td>
                                    <td>${item.purchase_order_item}</td>
                                    <td>${item.purchase_order_item_qty}</td>
                                    <td>${formatNumber(item.purchase_order_item_unit_price)}</td>
                                    <td>${formatNumber(item.purchase_order_item_qty * item.purchase_order_item_unit_price)}</td>
                                </tr>
                            `
                        }

                        printModal.find('#item-list tbody').html(itemsHTML);
                    }
                    else
                    {
                        showSimpleMessage("Attention", response.message, "error");   
                    }
                },
                error: function(req, status, error)
                {
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                }
            });
        });

        $('#transactions').on('click', '.btn-edit', function(){
            var transactionID = $(this).attr('data-id');
            var editTransactionModal = $('#editTransactionModal');

            //fetch transaction details
            $.ajax({
                url: `${API_URL_ROOT}/transactions/${transactionID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var transaction = response.transaction;

                        editTransactionModal.find('.modal-title').text(transaction.transaction_title);
                        editTransactionModal.find('#transaction_type1').selectpicker('val', transaction.transaction_type);
                        editTransactionModal.find('#transaction_mode1').selectpicker('val', transaction.transaction_mode);
                        editTransactionModal.find('#transaction_title1').val(transaction.transaction_title);
                        editTransactionModal.find('#transaction_recipient1').val(transaction.transaction_recipient);
                        editTransactionModal.find('#teller_no1').val(transaction.teller_no);
                        editTransactionModal.find('#bank1').val(transaction.bank);
                        editTransactionModal.find('#expected_amount1').val(transaction.expected_amount);
                        editTransactionModal.find('#transacted_amount1').val(transaction.transacted_amount);
                        editTransactionModal.find('#transaction_remarks1').val(transaction.transaction_remarks);
                        editTransactionModal.find('#transaction_id').val(transactionID);

                        if(payloadClaim(token, 'user_role') == "Super Admin")
                        {
                            editTransactionModal.find('#store_id2').selectpicker('val', transaction.store_id);
                        }
                    }
                    else
                    {
                        showSimpleMessage("Attention", response.message, "error");   
                    }
                },
                error: function(req, status, error)
                {
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                }
            });
        });

        $('#filter').on('submit', function(e){
            e.preventDefault();

            var form = $(this);
            var storeID = payloadClaim(token, 'user_role') == "Admin" ? payloadClaim(token, 'user_store_id') : form.find('#store_id').val();
            var userID = form.find('#user_id').val();
            var status = form.find('#status').val();
            var startTime = form.find('#datepicker').val();
            var endTime = form.find('#datepicker1').val();
            var transactionType = form.find('#transaction_type').val();
            var transactionMode = form.find('#transaction_mode').val();
            var fields = form.find('input.required, select.required');

            blockUI();

            for(var i=0;i<fields.length;i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    $('#'+fields[i].id).focus();
                    unblockUI();
                    showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                    return false;
                }
            }

            loadTransactions(storeID, userID, status, startTime, endTime, transactionType, transactionMode);
            $('#transactions').attr({'store-id':storeID, 'user-id':userID, status, 'start-time':startTime, 'end-time':endTime, 'transaction-type':transactionType, 'transaction-mode':transactionMode});
            unblockUI();
        });

        $('#form-new-transaction').on('submit', function(e){

            e.preventDefault();

            submitTransaction();
        }) 

        $('#form-update-transaction').on('submit', function(e){

            e.preventDefault();

            updateTransaction();
        });

        $('body').on('click', '#btn-generate-report', function(){
            
            var table = $('#transactions');
            var storeID = payloadClaim(token, 'user_role') == "Admin" ? payloadClaim(token, 'user_store_id') : table.attr('store-id');
            var userID = table.attr('user-id');
            var status = table.attr('status');
            var startTime = table.attr('start-time');
            var endTime = table.attr('end-time');
            var transactionType = table.attr('transaction-type');
            var transactionMode = table.attr('transaction-mode');
            var reportModal = $("#reportModal");

            blockUI();

            $.ajax({
                type:'GET',
                url:`${API_URL_ROOT}/transactions?store_id=${storeID}&user_id=${userID}&status=${status}&start_time=${startTime}&end_time=${endTime}&transaction_type=${transactionType}&transaction_mode=${transactionMode}`,
                dataType:'json',
                headers:{ 'x-access-token':token },
                success:function(response)
                {
                    if(response.error == false)
                    {
                        var transactions = response.result.transactions;

                        var transactionsHTML = '';

                        var serial = 0;

                        var totalIncome = 0;
                        var totalExpenditure = 0;


                        for(var i = 0; i < transactions.length; i++)
                        {
                            const transaction = transactions[i];

                            transactionsHTML += `
                                <tr>
                                    <td>${serial += 1}</td>
                                    <td>${transaction.store_name}</td>
                                    <td>${transaction.transacted_by}</td>
                                    <td>${transaction.transaction_recipient}</td>
                                    <td>
                                        ${moment.unix(transaction.transaction_timestamp).format('MMMM Do YYYY')}
                                    </td>
                                    <td>${transaction.transaction_title}</td>
                                    <td>${transaction.transaction_type}</td>
                                    <td>${transaction.transaction_mode}</td>
                                    <td style="font-weight:700">
                                        ${formatNumber(transaction.expected_amount)}
                                    </td>
                                </tr>
                            `;

                            transaction.transaction_type == "Income" ? totalIncome += transaction.expected_amount : totalExpenditure += transaction.expected_amount;
                        }

                        reportModal.find('#Transactions tbody').html(transactionsHTML);
                        reportModal.find('.income').text(`NGN ${formatNumber(totalIncome)}`);
                        reportModal.find('.expenditure').text(`NGN ${formatNumber(totalExpenditure)}`);
                        reportModal.find('.closing-balance').text(`NGN ${formatNumber(totalIncome -totalExpenditure)}`);
                        startTime ? reportModal.find('.opening-date').text(moment(startTime).format('MMMM Do, YYYY')) : reportModal.find('.opening-date').text('-');
                        endTime ? reportModal.find('.closing-date').text(moment(endTime).format('MMMM Do, YYYY')) : reportModal.find('.closing-date').text('-');

                        if(payloadClaim(token, 'user_role') == "Admin")
                        {
                            reportModal.find('.store').text(`${payloadClaim(token, 'user_store_name')}`);
                        }

                        unblockUI();
                    }
                    else
                    {
                        unblockUI();
                        showSimpleMessage("Attention", response.message, "error");
                    }
                },
                error: function(req, status, error)
                {
                    unblockUI();
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                }
            })
        });
    });

    //internal function to delete a transaction
    function deleteTransaction(transactionID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this transaction?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var table = $('#transactions');
                
                blockUI();        

                $.ajax({
                    type: 'DELETE',
                    url: `${API_URL_ROOT}/transactions/${transactionID}`,
                    dataType: 'json',
                    headers: {'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            table.DataTable().ajax.reload(null, false);   
                        }
                        else
                        {
                            unblockUI();
                            showSimpleMessage("Attention", response.message, "error");
                        }
                    },
                    error: function(req, status, error)
                    {
                        unblockUI();
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                    }
                });
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }
    
    //load transactions
    function loadTransactions(storeID = '', userID = '', status = '', startTime = '', endTime = '', transactionType = '', transactionMode = '')
    {
        var table = $('#transactions');

        var storeID = payloadClaim(token, 'user_role') !== "Super Admin" ? payloadClaim(token, 'user_store_id') : storeID;

        table.DataTable({
            dom: `<"row"<"col-md-12"<"row"<"col-md-4"l><"col-md-4"B><"col-md-4"f>>><"col-md-12"rt><"col-md-12"<"row"<"col-md-5"i><"col-md-7"p>>>>`,
            buttons: {
                buttons: [
                    { extend: 'copy', className: 'btn' },
                    { extend: 'csv', className: 'btn' },
                    { extend: 'excel', className: 'btn' },
                    { extend: 'print', className: 'btn' },
                    {
                        className:'btn',
                        text:'New Transaction',
                        attr:  {
                            title: 'New Transaction',
                            id: 'btn-new-transaction',
                            'data-toggle':"modal",
                            'data-target':"#transactionModal", 
                            'data-animation':"fall", 
                            'data-plugin':"custommodal", 
                            'data-overlayColor':"#012"
                        }
                    },
                    {
                        className:'btn',
                        text:'Generate Report',
                        attr:  {
                            title: 'Generate Report',
                            id: 'btn-generate-report',
                            'data-toggle':"modal",
                            'data-target':"#reportModal", 
                            'data-animation':"fall", 
                            'data-plugin':"custommodal", 
                            'data-overlayColor':"#012"
                        }
                    }
                ]
            },
            oLanguage: {
                oPaginate: { 
                    sPrevious: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' 
                },
                sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
                sSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                sSearchPlaceholder: "Search...",
               sLengthMenu: "Results :  _MENU_",
            },
            lengthMenu: [7, 10, 20, 50, 100, 500, 1000],
            stripeClasses: [],
            drawCallback: function () { $('.dataTables_paginate > .pagination').addClass(' pagination-style-13 pagination-bordered mb-5'); },
            language: {
                infoEmpty: "<span style='color:red'><b>No records found</b></span>"
            },
            processing: true,
            serverSide: true,
            destroy: true,
            autoWidth: false,
            pageLength: 100,
            ajax: {
                type: 'GET',
                url: `${API_URL_ROOT}/transactions/data-table/fetch?store_id=${storeID}&user_id=${userID}&status=${status}&start_time=${startTime}&end_time=${endTime}&transaction_type=${transactionType}&transaction_mode=${transactionMode}`,
                dataType: 'json',
                headers:{'x-access-token':token},
                complete: function()
                {
                    //$("#loadingScreen").hide();
                    //$('.panel-refresh').click();
                },
                async: true,
                error: function(xhr, error, code)
                {
                    console.log(xhr);
                    console.log(code);
                }
            },
            columnDefs: [
                { orderable: false, targets: [1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
            ],
            order: [[0, "desc"]],
            columns: [
                {
                    data: 'transaction_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {data: 'store_name'},
                {data: 'recorded_by'},
                {data: 'transaction_type'},
                {data: 'transaction_mode'},
                {data: 'transaction_title'},
                {data: 'transaction_recipient'},
                {
                    data: 'transaction_timestamp',
                    render: function(data, type, row, meta)
                    {
                        return moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },
                {
                    data: 'expected_amount',
                    render:function(data, type, row, meta)
                    {
                        return formatNumber(data);
                    }
                },
                {
                    data: 'transacted_amount',
                    render:function(data, type, row, meta)
                    {
                        return formatNumber(data);
                    }
                },
                {
                    data: 'balance',
                    render:function(data, type, row, meta)
                    {
                        return formatNumber(data);
                    }
                },
                
                {
                    data: 'transaction_status',
                    render:function(data, type, row, meta)
                    {
                        var transactionStatus = data == "Uncompleted" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return transactionStatus;
                    }
                },
                {
                    data: 'transaction_id',
                    render: function(data, type, row, meta)
                    {
                        var actions = `
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit Transaction" data-id="`+data+`" data-toggle="modal" data-target="#editTransactionModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete Transaction" data-id="`+data+`"><i class="mdi mdi-close"></i>
                            </a>
                        `;

                        return actions;
                    },
                    searchable: false,
                    sortable: false
                }
            ]  
        });
    }

    function loadUsers()
    {
        var storeID = payloadClaim(token, 'user_role') == "Super Admin" ? '' : payloadClaim(token, 'user_store_id');

        $.ajax({
            url:`${API_URL_ROOT}/users?store_id=${storeID}`,
            type:'GET',
            dataType:'json',
            headers:{'x-access-token':token},
            success:function(response)
            {
                var users = response.result.users;
                var html = '';

                for(var i = 0; i < users.length; i++)
                {
                    html += `
                        <option value="${users[i].user_id}">${users[i].user_firstname} ${users[i].user_lastname}</option>
                    `
                }

                $('#user_id').append(html);
                $('.selectpicker').selectpicker('refresh');

            },
            error:function(req, status, err)
            {
                showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
            }
        })
    }

    //load stores
    function loadStores()
    {
        if(payloadClaim(token, 'user_role') == "Super Admin")
        {
            blockUI();

            $.ajax({
                type:'GET',
                url: `${API_URL_ROOT}/stores?status=Active`,
                dataType: 'json',
                headers:{ 'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var stores = response.result.stores;

                        var html = '';

                        for(var i = 0; i < stores.length; i++)
                        {
                            html += `
                                <option value="${stores[i].store_id}">${stores[i].store_name}</option>
                            `
                        }

                        $("#store_id").append(html);
                        $("#store_id1").append(html);
                        $("#store_id2").append(html);
                        $('.selectpicker').selectpicker('refresh');
                        unblockUI();
                    }
                    else
                    {
                        unblockUI();
                        showSimpleMessage("Attention", response.message, "error");       
                    }
                },
                error:function(req, status, error)
                {
                    unblockUI();
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                }
            })
        }
    }

    function priceSummary(parentModal)
    {
        var total = 0;

        parentModal.find('tbody').find('tr').each(function(){
            total += parseFloat($(this).find('.sub_total').val() || 0);
        });

        parentModal.find('.purchase_order_total_amount').attr('data-value', total);
        parentModal.find('.purchase_order_total_amount').text(formatNumber(total));
    }

    function pricing()
    {
        $('#ordered-items-list, #ordered-items-list1').on('keyup change', '.purchase_order_item_qty, .purchase_order_item_unit_price', function(){

            var _this = $(this);
            var parentModal = _this.parents('.modal');
            var parentTable = _this.parents('.table');
            var parentTR = _this.parents('tr');
            var qty = parseFloat(parentTR.find('.purchase_order_item_qty').val() || 0);
            var unitPrice = parseFloat(parentTR.find('.purchase_order_item_unit_price').val() || 0);

            if(isNaN(_this.val()))
            {
                showSimpleMessage("Attention", "Quantity ordered & Unit Price must be numbers only", "error");

                _this.val(0);
            }
            else
            {
                parentTR.find('.sub_total').val((qty * unitPrice));

                priceSummary(parentModal);
            }
        });
    }

    function removeOrderItem()
    {
        $('#ordered-items-list, #ordered-items-list1').on('click', '.btn-remove', function(){

            var parentModal = $(this).parents('.modal');

            var parentTable = $(this).parents('.table');

            var parentTR = $(this).parents('tr');

            var TRCount = parentTable.find('tbody').find('tr').length;

            if(TRCount == 1)
            {
                showSimpleMessage("Attention", "You cannot remove all records", "error");
                return false;
            }

            parentTR.remove(); 

            priceSummary(parentModal);
        });
    }

    function newOrderItem()
    {
        $('#ordered-items-list, #ordered-items-list1').on('click', '.btn-add', function(){
            
            var parentModal = $(this).parents('.modal');

            var parentTR = $(this).parents('tr');

            var rowID = parseInt(parentTR.attr('data-row-id'));

            var uuidV4 = uuidv4();

            var storeID = payloadClaim(token, 'user_role') == "Super Admin" ? parentModal.find('.store_id').find('option:selected').val() : payloadClaim(token, 'user_store_id');

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
        })
    }

    function fixTableResponsive()
    {
        $('.table-responsive').on('shown.bs.dropdown', function(e) {
            
            var t = $(this),
                m = $(e.target).find('.dropdown-menu'),
                tb = t.offset().top + t.height(),
                mb = m.offset().top + m.outerHeight(true),
                d = 20; // Space for shadow + scrollbar.   
            
            if (t[0].scrollWidth > t.innerWidth()) 
            {
                if (mb + d > tb) 
                {
                    t.css('padding-bottom', ((mb + d) - tb));
                }
            } 
            else 
            {
                t.css('overflow', 'visible');
            }
        }).on('hidden.bs.dropdown', function() {
            $(this).css({
                'padding-bottom': '',
                'overflow': ''
            });
        });
    }

    function purchaseModalSetup()
    {
        $('.cashier').text(`${payloadClaim(token, 'user_firstname')} ${payloadClaim(token, 'user_lastname')}`);
        $('.order_date').text(`${moment().format('MMMM Do, YYYY')}`);
    }

    function submitTransaction()
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to submit this transaction?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#form-new-transaction'); //form
                var fields = form.find('input.required, select.required');
                var table = $('#transactions').DataTable();
                
                blockUI();

                for(var i = 0; i < fields.length; i++)
                {
                    if(fields[i].value == "")
                    {
                        unblockUI();
                        form.find(`[name="${fields[i].name}"]`).focus();  
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        return false;
                    }
                }
                
                $.ajax({
                    type: 'POST',
                    url: API_URL_ROOT+'/transactions',
                    data: JSON.stringify(form.serializeObject()),
                    dataType: 'json',
                    contentType: 'application/json',
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI(); 
                            showSimpleMessage("Success", response.message, "success");
                            form.get(0).reset();
                            $('.selectpicker').selectpicker('refresh');
                            table.ajax.reload(null, false);
                        }
                        else
                        {
                            unblockUI();   
                            showSimpleMessage("Attention", response.message, "error");
                        }
                    },
                    error: function(req, status, error)
                    {
                        unblockUI();   
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                    }
                });
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    function updateTransaction()
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this transaction?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#form-update-transaction'); //form
                var fields = form.find('input.required, select.required');
                var transactionID = form.find('#transaction_id').val();
                var table = $('#transactions').DataTable();
                var editTransactionModal = $('#editTransactionModal');
                
                blockUI();

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        unblockUI();
                        form.find(`[name="${fields[i].name}"]`).focus();  
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        return false;
                    }
                }
                
                $.ajax({
                    type: 'PUT',
                    url: `${API_URL_ROOT}/transactions/${transactionID}`,
                    data: JSON.stringify(form.serializeObject()),
                    dataType: 'json',
                    contentType: 'application/json',
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI(); 
                            showSimpleMessage("Success", response.message, "success");
                            editTransactionModal.find('.close').click();
                            table.ajax.reload(null, false);
                        }
                        else
                        {
                            unblockUI();   
                            showSimpleMessage("Attention", response.message, "error");
                        }
                    },
                    error: function(req, status, error)
                    {
                        unblockUI();   
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                    }
                });
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    function refreshForm()
    {
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

        $('#ordered-items-list tbody').html(itemList);
        $('.summary').html(summaryHTML);
        $('.selectpicker').selectpicker('refresh');
    }

    function print()
    {
        $('#reportModal').on("click", ".btn-print", function () {

            const content = $(".content");

            const printArea = $("#reportModal .print-area").detach();
            const containerFluid = $(".container-fluid").detach();

            content.append(printArea);

            const backdrop = $('body .modal-backdrop').detach()
            $('.modal-backdrop').remove();

            window.print();

            content.empty();
            content.append(containerFluid);

            $("#reportModal .modal-body").append(printArea);

            $('body').append(backdrop);
        });
    }
}); 