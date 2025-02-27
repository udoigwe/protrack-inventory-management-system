$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

    $(document).ready(function($){

        dataTableAlertPrevent('table'); 
        loadUsers(); 
        loadStores(); 

        //add user
        $('#form-new-user').on('submit', function(e){
            e.preventDefault(); //prevent default form submission event
            addUser(); //Internal function for form submission
        });

        //update user
        $('#form-update-user').on('submit', function(e){
            e.preventDefault();
            updateUser();
        });

        $('#users').on('click', '.btn-delete', function(){
            var userID = $(this).attr('data-id');
            deleteUser(userID);  
        });

        $('#users').on('click', '.btn-edit', function(){
            var userID = $(this).attr('data-id');
            var editModal = $('#editModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/users/${userID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error == false)
                    {
                        var user = response.user;
                        editModal.find('.modal-title').text(`${user.user_firstname} ${user.user_lastname}`);
                        editModal.find('#user_firstname1').val(user.user_firstname);
                        editModal.find('#user_lastname1').val(user.user_lastname);
                        editModal.find('#user_gender1').selectpicker('val', user.user_gender);
                        editModal.find('#user_email1').val(user.user_email);
                        editModal.find('#user_phone1').val(user.user_phone);
                        editModal.find('#user_role1').selectpicker('val', user.user_role);
                        editModal.find('#write_rights').selectpicker('val', user.write_rights);
                        editModal.find('#update_rights').selectpicker('val', user.update_rights);
                        editModal.find('#delete_rights').selectpicker('val', user.delete_rights);
                        editModal.find('#login_rights').selectpicker('val', user.login_rights);
                        editModal.find('#user_id').val(user.user_id);

                        if(payloadClaim(token, 'user_role') == "Super Admin")
                        {
                            editModal.find('#store_id2').selectpicker('val', user.store_id);
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
            var role = form.find('#user_role2').val();
            var storeID = payloadClaim(token, 'user_role') == "Admin" ? payloadClaim(token, 'user_store_id') : form.find('#store_id1').val();
            var fields = form.find('input.required, select.required');

            for(var i=0;i<fields.length;i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    //unblockUI();
                    $('#'+fields[i].id).focus();
                    showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                    return false;
                }
            }

            $('#users').attr({user_role:role, user_store_id:storeID});
            loadUsers();
        })  
    });

    //internal function to add user
    function addUser() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to add this user?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#form-new-user'); //form
                var email = form.find("#user_email").val(); //user email from form
                var password = form.find("#password").val(); //user password from form
                var rePassword = form.find("#re-password").val(); //user confirmed password from form
                var table = $('#users').DataTable();
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
            
                if(!validateEmail(email))
                {
                    //email format is invalid
                    unblockUI();
                    $("#user_email").focus();
                    showSimpleMessage("Attention", "Please provide a valid user email address", "error");
                    return false;   
                } 
                else if(password !== rePassword)
                {
                    //password does not match
                    unblockUI();
                    $("#re-password").focus();
                    showSimpleMessage("Attention", "Passwords dont match", "error");
                    return false; 
                }
                else
                {
                    $.ajax({
                        type: 'POST',
                        url: `${API_URL_ROOT}/users`,
                        data: JSON.stringify(form.serializeObject()),
                        dataType: 'json',
                        contentType: 'application/json',
                        headers:{
                            'x-access-token':token,
                        },
                        success: function(response)
                        {
                            if(response.error == false)
                            {
                                unblockUI();
                                showSimpleMessage("Success", response.message, "success");                
                                form.get(0).reset();
                                $('.selectpicker').selectpicker('val', '');
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
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to update user
    function updateUser() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this user?",
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
                var form = $('#form-update-user'); //form
                var userID = form.find('#user_id').val();
                var email = form.find('#user_email1').val();
                var table = $('#users').DataTable();
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

                if(!validateEmail(email))
                {
                    unblockUI();
                    showSimpleMessage("Attention", "Please provide a valid email address", "error");
                    return false;
                }
                else
                {
                    $.ajax({
                        type: 'PUT',
                        url: `${API_URL_ROOT}/users/${userID}`,
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
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to delete user
    function deleteUser(userID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this user?",
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
                var table = $('#users');
                var rowCount = table.find('tbody tr').length; 

                blockUI();        

                $.ajax({
                    type: 'DELETE',
                    url: `${API_URL_ROOT}/users/${userID}`,
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
    
    //load users
    function loadUsers()
    {
        var table = $('#users');
        var storeID = payloadClaim(token, 'user_role') == "Admin" ? payloadClaim(token, 'user_store_id') : table.attr('user_store_id') ? table.attr('user_store_id') : '';
        var userRole = table.attr('user_role') ? table.attr('user_role'): '';
        var url = `${API_URL_ROOT}/users/data-table/fetch?user_role=${userRole}&store_id=${storeID}`;

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
                url,
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
                { orderable: false, targets: [1,2, 3, 4, 5, 6, 7, 8, 9, 10] }
            ],
            order: [[0, "desc"]],
            columns: [
                {
                    data: 'user_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: 'user_firstname',
                    render: function(data, type, row, meta)
                    {
                        return data + ' ' + row['user_lastname'];
                    }
                },
                {data: 'user_phone'},
                {data: 'user_email'},
                {data: 'store_name'},
                {data: 'user_role'},
                {
                    data: 'user_created_at',
                    render: function(data, type, row, meta)
                    {
                        return moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                    }
                },
                {
                    data: 'write_rights',
                    render:function(data, type, row, meta)
                    {
                        var writeRights = data == "Denied" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return writeRights;
                    }
                },
                {
                    data: 'update_rights',
                    render:function(data, type, row, meta)
                    {
                        var updateRights = data == "Denied" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return updateRights;
                    }
                },
                {
                    data: 'delete_rights',
                    render:function(data, type, row, meta)
                    {
                        var deleteRights = data == "Denied" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return deleteRights;
                    }
                },
                {
                    data: 'login_rights',
                    render:function(data, type, row, meta)
                    {
                        var loginRights = data == "Denied" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return loginRights;
                    }
                },
                {
                    data: 'user_id',
                    render: function(data, type, row, meta)
                    {
                        var actions = `
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-edit" title="Edit User" data-id="`+data+`" data-toggle="modal" data-target="#editModal" data-animation="fall" data-plugin="custommodal" data-overlayColor="#012"><i class="mdi mdi-pencil"></i>
                            </a>
                            <a href="javascript:void(0);" class="btn btn-link font-18 text-muted btn-sm btn-delete" title="Delete User" data-id="`+data+`"><i class="mdi mdi-close"></i>
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

    //load stores
    function loadStores()
    {
        if(payloadClaim(token, 'user_role') == "Super Admin")
        {
            blockUI();

            $.ajax({
                type:'GET',
                url: `${API_URL_ROOT}/stores`,
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
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");       
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
}); 