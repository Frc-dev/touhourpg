<div class="form-group row mb-4">
    <!-- TODO: Use localstorage to cache validation api calls https://medium.com/@brockreece/frontend-caching-strategies-38c57f59e254 -->
    <label for="nick" class="col-md-4 col-form-label text-md-right">@lang('messages.auth.user.name')</label>
    <div class="col-md-6 field">
        <input id="nickField" type="text"
               class="fieldform form-control" name="nick"
               value="{{ old('nick') }}" required autocomplete="nick" autofocus>
    </div>
</div>
