<script lang="ts">
    import '../../app.css';
    let { children } = $props();
</script>

<div class="top-bar">
    <button class="page-link"><a href='/draft2'>Draft</a></button>
    <button class="page-link"><a href='/draft2/table'>League Table</a></button>
</div>

<style>
    .top-bar {
        display: flex;
        justify-content: space-around;
        background-color: #f8f9fa;  
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);  
    }

    button {
        margin-top: 1rem;
        margin-bottom: 1rem;
        font-size: 1.3rem;
        font-weight: 600;  
        background-color: #798aa7;  
        border: none;
        border-radius: 8px;  
        padding: 0.5rem 1rem;  
        transition: background-color 0.2s ease;  
        cursor: pointer;
    }

    button:hover {
        background-color: #2563eb;  
    }

    button a {
        color: white;
        text-decoration: none;
    }
</style>

{@render children()}