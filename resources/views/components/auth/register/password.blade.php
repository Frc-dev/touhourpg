<div class="form-group row mb-4">
    <label for="password"
           class="col-md-4 col-form-label text-md-right">@lang('Password')</label>

    <div class="col-md-6">
        <input id="password" type="password"
               class="fieldform form-control @error('password') is-invalid @enderror"
               name="password" required autocomplete="new-password">

        @error('password')
        <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
        @enderror
    </div>
</div>
