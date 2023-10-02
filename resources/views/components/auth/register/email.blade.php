<div class="form-group d-flex flex-row mb-4">
    <label for="email"
           class="col-md-4 col-form-label text-md-right">@lang('messages.auth.email.singular_entity')
        <button type="button" class="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#mailModal">
            ?
        </button>
    </label>

    <div class="col-md-6 field">
        <input id="emailField" type="email"
               class="fieldform form-control" name="email"
               value="{{ old('email') }}" required autocomplete="email">
    </div>
    <!-- Modal -->
    <div class="modal fade" id="mailModal" tabindex="-1" role="dialog"
         aria-labelledby="mailModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    @lang('messages.auth.email.optional')
                </div>
            </div>
        </div>
    </div>
</div>
