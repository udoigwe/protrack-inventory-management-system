$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

    $(document).ready(function($){

        dataTableAlertPrevent('table'); 
        loadStores(); 

        //add stores
        $('#form-new-store').on('submit', function(e){
            e.preventDefault(); //prevent default form submission event
            addStore(); //Internal function for form submission
        });

        //update store
        $('#form-update-store').on('submit', function(e){
            e.preventDefault();
            updateStore();
        });

        $('#stores').on('click', '.btn-delete', function(){
            var storeID = $(this).attr('data-id');
            deleteStore(storeID);  
        });

        $('#stores').on('click', '.btn-edit', function(){
            var storeID = $(this).attr('data-id');
            var editModal = $('#editModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/stores/${storeID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var store = response.store;
                        editModal.find('#logo').attr({src:`${API_HOST_NAME}/logos/${store.store_logo}`, alt:store.store_name})
                        editModal.find('.modal-title').text(store.store_name);
                        editModal.find('#store_name1').val(store.store_name);
                        editModal.find('#store_address1').val(store.store_address);
                        editModal.find('#store_status').selectpicker('val', store.store_status);
                        editModal.find('#store_id').val(store.store_id);
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
    });

    //internal function to add new store
    function addStore() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to add this store?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#form-new-store'); //form
                var table = $('#stores').DataTable();
                var fields = form.find('input.required, select.required');
                var storeLogo = $('#store_logo').val();
                var file_length = $("#store_logo").get(0).files.length;
                var extension = storeLogo.split('.').pop().toLowerCase();
                var validFileExtensions = ['jpeg', 'jpg', 'png'];

                blockUI();                      

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id)*/
                        unblockUI();
                        $('#'+fields[i].id).focus();
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        return false;
                    }
                }

                if($.inArray(extension, validFileExtensions) == -1)
                {
                    //invalid avatar format
                    unblockUI();
                    $("#store_logo").focus();
                    showSimpleMessage("Attention", "Store logo must be a jpeg, jpg, png file", "error");
                    return false;
                }

                if($("#store_logo").get(0).files[0].size > (1024 * 1000)) 
                {
                    //logo is more than 1MB
                    unblockUI();
                    $("#store_logo").focus();
                    showSimpleMessage("Attention", "Store Logo must not be more than 1MB in size", "error");
                    return false;
                }
            
                $.ajax({
                    type: 'POST',
                    url: `${API_URL_ROOT}/stores`,
                    data: new FormData(form[0]),
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            table.ajax.reload(null, false);
                            form.get(0).reset();
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
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                    }
                });  
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to update store
    function updateStore() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this store?",
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
                var form = $('#form-update-store'); //form
                var storeID = form.find('#store_id').val();
                var table = $('#stores').DataTable();
                var storeLogo = $('#store_logo1').val();
                var fields = form.find('input.required, select.required');
                
                blockUI();

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id);*/
                        unblockUI(); 
                        showSimpleMessage("Attention", "All marked fields are required", "error");
                        $('#'+fields[i].id).focus();
                        return false;
                    }
                }

                if(storeLogo)
                {
                    var extension = storeLogo.split('.').pop().toLowerCase();
                    //Create array with the file extensions that we wish to upload
                    var validFileExtensions = ['jpeg', 'jpg', 'png'];
                    var file_length = $("#store_logo1").get(0).files.length;

                    if($.inArray(extension, validFileExtensions) == -1)
                    {
                        //invalid avatar format
                        unblockUI();
                        $("#store_logo1").focus();
                        showSimpleMessage("Attention", "Store Logo must be a jpeg, jpg, png format", "error");
                        return false;
                    } 
                    
                    if($("#store_logo1").get(0).files[0].size > (1024 * 1000)) 
                    {
                        //user image is more than 200KB
                        unblockUI();
                        $("#store_logo1").focus();
                        showSimpleMessage("Attention", "Store logo must not be more than 1MB in size", "error");
                        return false;
                    }
                }

                $.ajax({
                    type: 'PUT',
                    url: `${API_URL_ROOT}/stores/${storeID}`,
                    data: new FormData(form[0]),
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            table.ajax.reload(null, false);
                            form.find('#store_logo1').val('');
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
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                    }
                }); 
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to delete a store
    function deleteStore(storeID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this store?",
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
                var table = $('#stores');
                var rowCount = table.find('tbody tr').length; 

                blockUI();        

                $.ajax({
                    type: 'DELETE',
                    url: `${API_URL_ROOT}/stores/${storeID}`,
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
    
    //load stores
    function loadStores()
    {
        var table = $('#stores');

        table.DataTable({
            oLanguage: {
                oPaginate: { 
                    sPrevious: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>', "sNext": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' 
                },
                sInfo: "Showing page _PAGE_ of _PAGES_",
                sSearch: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
                sSearchPlaceholder: "Search...",
               sLengthMenu: "Results :  _MENU_",
            },
            lengthMenu: [7, 10, 20, 50, 100],
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
                url: API_URL_ROOT+'/stores/data-table/fetch',
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
                { orderable: false, targets: [1,2, 3, 4] }
            ],
            order: [[0, "desc"]],
            columns: [
                {
                    data: 'store_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {data: 'store_name'},
                {data: 'store_address'},
                {
                    data: 'store_created_at',
                    render: function(data, type, row, meta)
                    {
                        return moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },
                {
                    data: 'store_status',
                    render:function(data, type, row, meta)
                    {
                        var storeStatus = data == "Inactive" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return storeStatus;
                    }
                },
                {
                    data: 'store_id',
                    render: function(data, type, row, meta)
                    {
                        var actions = `
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit Store" data-id="`+data+`" data-toggle="modal" data-target="#editModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete Store" data-id="`+data+`"><i class="mdi mdi-close"></i>
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
}); 