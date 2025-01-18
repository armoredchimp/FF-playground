<script lang="ts">
	import '../../app.css';
	let { children } = $props();

	


</script>

<h4 class="page-link"><a href='/draft2'>Draft</a></h4>
<h4 class="page-link"><a href='/draft2/table'>League Table</a></h4>


<style>

    h4 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: bold;
        color: #1a202c;
    }



</style>

{@render children()}
