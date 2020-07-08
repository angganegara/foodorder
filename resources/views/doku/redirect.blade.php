@include('partials.header')

<body>

    <div class="doku-start">
        <div class="mb-5"><i class="fal fa-spinner-third fa-spin fa-5x"></i></div>
        <div class="mt-5">
            Redirecting you to <strong>Meal Plans</strong> page
        </div>
        <div class="mt-5">
            <a href="/checkout" title="" class="btn">Or click here if it is taking too long</a>
        </div>
    </div>

    <script>
        setTimeout(function () {
            window.location.href = '/doku/finish';
        }, 1500);
    </script>

</body>
</html>
