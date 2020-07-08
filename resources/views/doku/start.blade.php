@include('partials.header')

<body onload="document.formRedirect.submit()">

    <div class="doku-start">
        <div class="mb-5"><i class="fal fa-spinner-third fa-spin fa-5x"></i></div>
        <div class="mt-5">
            Redirecting you to <strong>DOKU</strong> payment page
        </div>
        <div class="mt-5">
            <form action="{{ $doku_request['url'] }}" method="post" id="formRedirect" name="formRedirect">
                @foreach ($doku_request['data'] as $key => $value)
                    <input type="hidden" name="{{ $key }}" value="{{ $value }}" />
                @endforeach
                <button class="btn" type="submit">Or click here if it is taking too long</button>
            </form>
        </div>
    </div>

</body>
</html>
