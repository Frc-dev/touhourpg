<div class="form-group d-flex flex-row mb-4">
    <label for="email"
           class="col-md-4 col-form-label text-md-right">@lang('E-mail address')</label>
    <div class="col-md-6 field">
        <input id="email" type="email"
               class="fieldform form-control @error('email') is-invalid @enderror" name="email"
               value="{{ old('email') }}" required autocomplete="email">

        @error('email')
        <span class="invalid-feedback" role="alert">
                                        <strong>@lang($message)</strong>
                                    </span>
        @enderror
    </div>
    <!-- add modal -->
    <button type="button" class="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#mailModal">
        ?
    </button>
    <!-- Modal -->
    <div class="modal fade" id="mailModal" tabindex="-1" role="dialog"
         aria-labelledby="mailModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    @lang('The e-mail is optional, and we will only use it if you ever need to recover your password. We promise not to send junk mail.')
                </div>
            </div>
        </div>
    </div>
</div>
