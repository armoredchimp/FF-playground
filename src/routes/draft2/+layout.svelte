<script lang="ts">
    import '../../app.css';
    import { draftStageState, getDraftStage } from '$lib/stores.svelte';
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
        align-items: center;
        background: linear-gradient(to bottom, #ffffff, #f4f5f7);
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        padding: 0.75rem 1rem;
        position: relative;
    }

    button {
        position: relative;
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
        background-color: transparent;
        border: none;
        padding: 0.75rem 1.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 6px;
        overflow: hidden;
    }

    button::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f1f5f9;
        transform: scale(0.95);
        opacity: 0;
        transition: all 0.2s ease;
        border-radius: 6px;
        z-index: 0;
    }

    button:hover::before {
        transform: scale(1);
        opacity: 1;
    }

    button a {
        position: relative;
        color: #475569;
        text-decoration: none;
        font-weight: 500;
        z-index: 1;
        transition: color 0.2s ease;
    }

    button:hover a {
        color: #1e293b;
    }

    @media (hover: hover) {
        button:active::before {
            background-color: #e2e8f0;
        }
    }
</style>

{@render children()}