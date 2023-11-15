<script lang="ts">
    import "../app.css"

</script>

<div class="h-full flex flex-col">
    <div class="flex-1">
        <slot />
    </div>

    <!-- Footer -->
    <div class="w-full h-8 bg-slate-200 flex justify-center items-center">
        <p class="mr-3">Parker Nilson &copy; 2023</p>
        <a href="https://github.com/parkernilson" class="hover:text-blue-600"><i class="fa-brands fa-github mr-2"></i></a>
        <a href="https://www.linkedin.com/in/parker-nilson-8a5971253/" class="hover:text-blue-600"><i class="fa-brands fa-linkedin"></i>
    </div>
</div>