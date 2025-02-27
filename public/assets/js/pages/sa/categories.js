$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

    $(document).ready(function($){

        dataTableAlertPrevent('table'); 
        loadCategories();

        //add product categories
        $('#form-new-category').on('submit', function(e){
            e.preventDefault(); //prevent default form submission event
            addCategory(); //Internal function for form submission
        });

        //update category
        $('#form-update-category').on('submit', function(e){
            e.preventDefault();
            updateCategory();
        });

        $('#categories').on('click', '.btn-delete', function(){
            var categoryID = $(this).attr('data-id');
            deleteCategory(categoryID);  
        });

        $('#categories').on('click', '.btn-edit', function(){
            var categoriesID = $(this).attr('data-id');
            var editModal = $('#editModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/categories/${categoriesID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var category = response.category;
                        editModal.find('.modal-title').text(category.product_category_name);
                        editModal.find('#product_category_name1').val(category.product_category_name);
                        editModal.find('#product_category_status').selectpicker('val', category.product_category_status);
                        editModal.find('#product_category_id').val(category.product_category_id);
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

    //internal function to add new category
    function addCategory() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to add this category?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#form-new-category'); //form
                var table = $('#categories').DataTable();
                var fields = form.find('input.required, select.required');

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
            
                $.ajax({
                    type: 'POST',
                    url: `${API_URL_ROOT}/categories`,
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

    //internal function to update category
    function updateCategory() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this category?",
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
                var form = $('#form-update-category'); //form
                var categoryID = form.find('#product_category_id').val();
                var table = $('#categories').DataTable();
                var fields = form.find('input.required, select.required');
                
                blockUI();

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id);*/
                        unblockUI(); 
                        $('#'+fields[i].id).focus();
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        return false;
                    }
                }

                $.ajax({
                    type: 'PUT',
                    url: `${API_URL_ROOT}/categories/${categoryID}`,
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
                            $('#editModal').find('.close').click();
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

    //internal function to delete a category
    function deleteCategory(categoryID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this category?",
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
                var table = $('#categories');
                var rowCount = table.find('tbody tr').length; 

                blockUI();        

                $.ajax({
                    type: 'DELETE',
                    url: `${API_URL_ROOT}/categories/${categoryID}`,
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
    
    //load categories
    function loadCategories(status = '')
    {
        var table = $('#categories');

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
                url: `${API_URL_ROOT}/categories/data-table/fetch?status=${status}`,
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
                { orderable: false, targets: [1,2, 3, 4, 5] }
            ],
            order: [[0, "desc"]],
            columns: [
                {
                    data: 'product_category_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {data: 'product_category_name'},
                {data: 'product_category_slug'},
                {
                    data: 'product_category_created_at',
                    render: function(data, type, row, meta)
                    {
                        return moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },
                {
                    data: 'product_category_status',
                    render:function(data, type, row, meta)
                    {
                        var productCategoryStatus = data == "Inactive" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return productCategoryStatus;
                    }
                },
                {
                    data: 'product_category_id',
                    render: function(data, type, row, meta)
                    {
                        var actions = `
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit Product Category" data-id="`+data+`" data-toggle="modal" data-target="#editModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete Product Category" data-id="`+data+`"><i class="mdi mdi-close"></i>
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