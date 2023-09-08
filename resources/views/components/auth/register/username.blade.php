<div class="form-group row mb-4">
    <label for="nick" class="col-md-4 col-form-label text-md-right">@lang('Username')</label>
    <div class="col-md-6 field">
        <input id="nick" type="text"
               class="fieldform form-control @error('nick') is-invalid @enderror" name="nick"
               value="{{ old('nick') }}" required autocomplete="nick" autofocus>
    </div>
</div>
