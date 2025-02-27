$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

	$(document).ready(function(){

        //init profile
        initAccountSettings();

        //validate and show avatar
        validateAvatar('avatar', 'imgprev', 'imgpreview', 1000000);

        //update profile
        $('#form-update-profile').on('submit', function(e){
            e.preventDefault();
            updateProfile();
        });

        //update my password
        $('#form-update-password').on('submit', function(e){
            e.preventDefault();
            updatePassword();
        });
    });

    //internal function to update user password
    function updatePassword() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update your password?",
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
                var form = $('#form-update-password'); //form
                var currentPassword = form.find('#current_password').val();
                var newPassword = form.find('#new_password').val();
                var rePassword = form.find('#re_password').val();
                var fields = form.find('input.required, select.required');  
                
                blockUI();        

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        unblockUI();
                        showSimpleMessage("Attention", "All fields are required", "error");
                        $('#'+fields[i].id).focus();
                        return false;
                    }
                }
            
                if(newPassword !== rePassword)
                {
                    //user image is more than 500kb
                    unblockUI();
                    $("#new_password").focus();
                    showSimpleMessage("Attention", "Passwords don't match", "error");
                    return false;
                }
                else
                {
                    $.ajax({
                        type: 'POST',
                        url: API_URL_ROOT+'/change-password',
                        data: new FormData(form[0]),
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        cache: false,
                        headers:{'x-access-token':token},
                        success: function(response)
                        {
                            if(response.error == false)
                            {
                                unblockUI();
                                showSimpleMessage("Success", response.message, "success");
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
            }
            else
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        }); 
    }

    function initAccountSettings()
    {
        $('.my-full-name').text(payloadClaim(token, 'user_firstname')+ ' ' + payloadClaim(token, 'user_lastname'));
        $('.my-gender').text(payloadClaim(token, 'user_gender'));
        $('.my-phone').text(payloadClaim(token, 'user_phone'));
        $('.my-email').text(payloadClaim(token, 'user_email'));
        $('.my-role').text(payloadClaim(token, 'user_role'));
        $('.my-store').text(payloadClaim(token, 'user_store_name'));

        $('#user_firstname').val(payloadClaim(token, 'user_firstname'));
        $('#user_lastname').val(payloadClaim(token, 'user_lastname'));
        $('#user_email').val(payloadClaim(token, 'user_email'));
        $('#user_phone').val(payloadClaim(token, 'user_phone'));
        $('#user_gender').selectpicker('val', payloadClaim(token, 'user_gender'));
    }

    //internal function to update account
    function updateProfile() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update your profile?",
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
                var form = $('#form-update-profile'); //form
                var email = $('#user_email').val();
                var fields = form.find('input.required, select.required');
                
                blockUI();

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id);*/
                        $('#'+fields[i].id).focus();
                        unblockUI(); 
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
                        url: `${API_URL_ROOT}/account-update`,
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
                                sessionStorage.removeItem('token');
                                sessionStorage.setItem('token', response.token);

                                //window.location.reload();
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
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }
}); 